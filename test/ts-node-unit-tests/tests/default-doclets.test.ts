/**
 * Checks that @default doclets on typed Options interface properties match the
 * values in the corresponding *Defaults.ts files.
 *
 * How it works:
 * - Scans `ts/**\/*Options.ts` files (excludes Dashboards, Grid, masters, .d.ts)
 * - For each Options file that has a matching `*Defaults.ts` sibling, finds all
 *   `const x: SomeType = { ... }` variable declarations in the Defaults file,
 *   also where the type is wrapped in `Partial<>` or `DeepPartial<>`
 * - For each such typed const, looks up the interface with the same name in the
 *   Options file and collects @default doclets from its properties
 * - Reports mismatches between documented and actual defaults
 * - For properties not set in the Defaults const, compares the doclet with the
 *   @default of the @apioption block in the Defaults file whose path is the
 *   const's @optionparent plus the property path
 *   (e.g. plotOptions.pie.innerSize)
 * - Separately, scans all Options files for @default doclets with template
 *   expressions (e.g. ${palette.*}), which are never valid default values
 * - Counts defaults that are set in the Defaults const or documented by an
 *   @apioption block, but have no @default doclet on the interface member
 * - Counts @default doclets whose property is neither set in the Defaults const
 *   nor documented by an @apioption block, as those can't be verified
 * - To list both counted groups as failures, run from repo root:
 *   `DEFAULT_DOCLETS_STRICT=1 npx tsx --test test/ts-node-unit-tests/tests/default-doclets.test.ts`
 *
 * Limitations:
 * - Properties whose defaults come from parent merges or inheritance are only
 *   verified where an @apioption block in the same Defaults file documents them
 * - Recurses only into inline type literals — does not follow named type references
 *   (e.g. a property typed as `SomeOtherOptions` won't have its members checked)
 * - Missing @default doclets are only reported for members declared inline in
 *   the interface, not for members of parent interfaces or named types
 * - Object values in the Defaults const are not expected to have a @default
 *   doclet, since their members are checked on their own
 * - @default doclets that are not valid TS literals are compared as raw text,
 *   and a quoted string matches the same text without quotes ('y' and y)
 */

import { before, describe, it } from 'node:test';
import { strictEqual } from 'node:assert';
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';

import * as glob from 'glob';
import TS from 'typescript';

const REPO_ROOT = join(__dirname, '..', '..', '..');
const OPTIONS_GLOB = 'ts/**/*Options.ts';
const IGNORE_GLOBS = [
    'ts/Dashboards/**',
    'ts/Grid/**',
    'ts/masters*/**',
    '**/*.d.ts'
];
const STRICT = !!process.env.DEFAULT_DOCLETS_STRICT;

type DefaultMap = Map<string, string>;

interface DefaultsObject {
    defaults: DefaultMap;
    optionParent?: string;
}

/**
 * Collects the `@default` doclets of an interface by property path. If `paths`
 * is given, it also receives the path of every inline member, with or without
 * a doclet.
 */
function collectDefaultTags(
    sourceFile: TS.SourceFile,
    interfaceName: string,
    paths?: Set<string>
): DefaultMap {
    const defaults: DefaultMap = new Map();

    for (const statement of sourceFile.statements) {
        if (
            TS.isInterfaceDeclaration(statement) &&
            statement.name.text === interfaceName
        ) {
            collectMembers(defaults, statement.members, '', paths);
        }
    }

    return defaults;
}

function collectDefaultsFromObject(
    objectLiteral: TS.ObjectLiteralExpression
): DefaultMap {
    const defaults: DefaultMap = new Map();

    collectObjectProperties(defaults, objectLiteral, '');

    return defaults;
}

function collectMembers(
    defaults: DefaultMap,
    members: TS.NodeArray<TS.TypeElement>,
    prefix: string,
    paths?: Set<string>
): void {
    for (const member of members) {
        if (!TS.isPropertySignature(member) || !member.type) {
            continue;
        }

        const name = getPropertyName(member.name);

        if (!name) {
            continue;
        }

        const path = getPath(prefix, name);
        const docletDefault = getDocletDefault(member);

        paths?.add(path);

        if (docletDefault) {
            defaults.set(path, docletDefault);
        }

        collectTypeMembers(defaults, member.type, path, paths);
    }
}

function collectObjectProperties(
    defaults: DefaultMap,
    objectLiteral: TS.ObjectLiteralExpression,
    prefix: string
): void {
    for (const property of objectLiteral.properties) {
        if (!TS.isPropertyAssignment(property)) {
            continue;
        }

        const name = getPropertyName(property.name);

        if (!name) {
            continue;
        }

        const path = getPath(prefix, name);
        const value = normalizeExpression(property.initializer);

        if (value) {
            defaults.set(path, value);
        }

        if (TS.isObjectLiteralExpression(property.initializer)) {
            collectObjectProperties(defaults, property.initializer, path);
        }
    }
}

function collectTypeMembers(
    defaults: DefaultMap,
    typeNode: TS.TypeNode,
    prefix: string,
    paths?: Set<string>
): void {
    if (TS.isParenthesizedTypeNode(typeNode)) {
        collectTypeMembers(defaults, typeNode.type, prefix, paths);
        return;
    }

    if (TS.isTypeLiteralNode(typeNode)) {
        collectMembers(defaults, typeNode.members, prefix, paths);
        return;
    }

    if (
        TS.isIntersectionTypeNode(typeNode) ||
        TS.isUnionTypeNode(typeNode)
    ) {
        for (const nestedType of typeNode.types) {
            collectTypeMembers(defaults, nestedType, prefix, paths);
        }
    }
}

function collectApiOptionDefaults(sourceFile: TS.SourceFile): DefaultMap {
    const defaults: DefaultMap = new Map();

    for (const [block] of sourceFile.text.matchAll(/\/\*\*[\s\S]*?\*\//gu)) {
        const tags = parseDocletTags(block);
        const apiOption = tags.get('apioption')?.split(/\s/u)[0];
        const docletDefault = normalizeDocletDefault(tags.get('default'));

        if (apiOption && docletDefault && !defaults.has(apiOption)) {
            defaults.set(apiOption, docletDefault);
        }
    }

    return defaults;
}

/**
 * Collects the defaults that an Options interface should document, by
 * property path: the values set in the Defaults object, and the `@default` of
 * each `@apioption` block below its `@optionparent`. Object values are
 * skipped, since their members are collected on their own.
 */
function collectKnownDefaults(
    defaultsObject: DefaultsObject,
    apiOptionDefaults: DefaultMap
): DefaultMap {
    const { defaults, optionParent } = defaultsObject;
    const known: DefaultMap = new Map();

    if (optionParent) {
        const prefix = `${optionParent}.`;

        for (const [apiOption, value] of apiOptionDefaults) {
            if (apiOption.startsWith(prefix)) {
                known.set(apiOption.slice(prefix.length), value);
            }
        }
    }

    for (const [path, value] of defaults) {
        if (!value.startsWith('{')) {
            known.set(path, value);
        }
    }

    return known;
}

function getDefaultsObjects(
    sourceFile: TS.SourceFile
): Map<string, DefaultsObject> {
    const defaults = new Map<string, DefaultsObject>();

    for (const statement of sourceFile.statements) {
        if (!TS.isVariableStatement(statement)) {
            continue;
        }

        for (const declaration of statement.declarationList.declarations) {
            const typeName = declaration.type &&
                getOptionsTypeName(declaration.type);

            if (
                !TS.isIdentifier(declaration.name) ||
                !typeName ||
                !declaration.initializer ||
                !TS.isObjectLiteralExpression(declaration.initializer)
            ) {
                continue;
            }

            const optionParentTag = TS.getJSDocTags(declaration)
                .find(tag => tag.tagName.text === 'optionparent');

            defaults.set(typeName, {
                defaults: collectDefaultsFromObject(declaration.initializer),
                optionParent: optionParentTag &&
                    stringifyComment(optionParentTag.comment) || void 0
            });
        }
    }

    return defaults;
}

/**
 * Returns the name of the Options interface that a Defaults object is typed
 * with. `Partial<FooOptions>` and `DeepPartial<FooOptions>` return
 * `FooOptions`.
 */
function getOptionsTypeName(typeNode: TS.TypeNode): (string|undefined) {
    if (
        !TS.isTypeReferenceNode(typeNode) ||
        !TS.isIdentifier(typeNode.typeName)
    ) {
        return;
    }

    const name = typeNode.typeName.text;
    const typeArguments = typeNode.typeArguments;

    if (
        (name === 'Partial' || name === 'DeepPartial') &&
        typeArguments?.length === 1
    ) {
        return getOptionsTypeName(typeArguments[0]);
    }

    return name;
}

function getDocletDefault(node: TS.Node): (string|undefined) {
    const defaultTag = TS.getJSDocTags(node)
        .find(tag => tag.tagName.text === 'default');

    if (!defaultTag) {
        return;
    }

    return normalizeDocletDefault(stringifyComment(defaultTag.comment));
}

/**
 * Compares two normalized defaults. A quoted string matches the same text
 * without quotes, since Defaults files often write strings without quotes,
 * such as `@default y`.
 */
function isSameDefault(a: string, b: string): boolean {
    const unquote = (value: string): string => (
        /^'.*'$/su.test(value) ?
            value.slice(1, -1).replace(/\\(.)/gu, '$1') :
            value
    );

    return a === b || unquote(a) === unquote(b);
}

function normalizeDocletDefault(
    comment: (string|undefined)
): (string|undefined) {
    if (
        !comment ||
        /^\{[a-z|]+\}\s/u.test(comment)
    ) {
        return;
    }

    return normalizeTextValue(comment) ?? comment;
}

/**
 * Reads the tags of a raw JSDoc block. The text of a tag runs until the next
 * line that starts with a tag, so a value on several lines, such as an array,
 * stays whole.
 */
function parseDocletTags(block: string): Map<string, string> {
    const tags = new Map<string, string>();
    let lines: (Array<string>|undefined);

    for (const line of block.slice(3, -2).split('\n')) {
        const text = line.replace(/^\s*\*?\s?/u, '');
        const match = text.match(/^@(\w+)\s*(.*)$/u);

        if (match) {
            // If a tag repeats, keep the first one
            lines = tags.has(match[1]) ? void 0 : [match[2]];

            if (lines) {
                tags.set(match[1], match[2]);
            }
            continue;
        }

        if (lines) {
            lines.push(text);
            tags.set([...tags.keys()].pop() as string, lines.join('\n'));
        }
    }

    for (const [name, text] of tags) {
        tags.set(name, text.trim());
    }

    return tags;
}

function collectTemplateDefaults(sourceFile: TS.SourceFile): Array<string> {
    const found: Array<string> = [];
    const visit = (node: TS.Node): void => {
        for (const tag of TS.getJSDocTags(node)) {
            const comment = stringifyComment(tag.comment);

            if (tag.tagName.text === 'default' && comment.includes('${')) {
                const { line } = sourceFile
                    .getLineAndCharacterOfPosition(tag.getStart());

                found.push(
                    `${sourceFile.fileName}:${line + 1}: @default ${comment}`
                );
            }
        }
        TS.forEachChild(node, visit);
    };

    visit(sourceFile);

    return found;
}

function getPath(prefix: string, name: string): string {
    return prefix ? `${prefix}.${name}` : name;
}

function getPropertyName(
    name: TS.PropertyName
): (string|undefined) {
    if (TS.isIdentifier(name) || TS.isPrivateIdentifier(name)) {
        return name.text;
    }

    if (TS.isStringLiteral(name) || TS.isNumericLiteral(name)) {
        return name.text;
    }
}

function normalizeExpression(
    expression: TS.Expression
): (string|undefined) {
    if (TS.isParenthesizedExpression(expression)) {
        return normalizeExpression(expression.expression);
    }

    if (
        TS.isAsExpression(expression) ||
        TS.isSatisfiesExpression(expression) ||
        TS.isTypeAssertionExpression(expression)
    ) {
        return normalizeExpression(expression.expression);
    }

    if (TS.isStringLiteral(expression)) {
        return quoteString(expression.text);
    }

    if (TS.isNoSubstitutionTemplateLiteral(expression)) {
        return quoteString(expression.text);
    }

    if (TS.isNumericLiteral(expression)) {
        return expression.getText();
    }

    if (TS.isPrefixUnaryExpression(expression)) {
        const operator = TS.tokenToString(expression.operator);
        const value = normalizeExpression(expression.operand);

        return operator && value ? `${operator}${value}` : void 0;
    }

    if (TS.isVoidExpression(expression)) {
        return 'undefined';
    }

    if (expression.kind === TS.SyntaxKind.TrueKeyword) {
        return 'true';
    }

    if (expression.kind === TS.SyntaxKind.FalseKeyword) {
        return 'false';
    }

    if (expression.kind === TS.SyntaxKind.NullKeyword) {
        return 'null';
    }

    if (expression.kind === TS.SyntaxKind.UndefinedKeyword) {
        return 'undefined';
    }

    if (
        TS.isIdentifier(expression) ||
        TS.isPropertyAccessExpression(expression)
    ) {
        return normalizeWhitespace(expression.getText());
    }

    if (TS.isArrayLiteralExpression(expression)) {
        const elements = expression.elements
            .map(element => normalizeExpression(element as TS.Expression));

        if (elements.some(element => typeof element === 'undefined')) {
            return;
        }

        return `[${elements.join(', ')}]`;
    }

    if (TS.isObjectLiteralExpression(expression)) {
        const properties: Array<string> = [];

        for (const property of expression.properties) {
            if (TS.isPropertyAssignment(property)) {
                const name = normalizeObjectPropertyName(property.name);
                const value = normalizeExpression(property.initializer);

                if (!name || !value) {
                    return;
                }

                properties.push(`${name}: ${value}`);
                continue;
            }

            if (TS.isShorthandPropertyAssignment(property)) {
                properties.push(property.name.text);
                continue;
            }

            if (TS.isSpreadAssignment(property)) {
                const value = normalizeExpression(property.expression);

                if (!value) {
                    return;
                }

                properties.push(`...${value}`);
                continue;
            }

            return;
        }

        return `{ ${properties.join(', ')} }`;
    }

    if (TS.isBinaryExpression(expression)) {
        const left = normalizeExpression(expression.left);
        const right = normalizeExpression(expression.right);

        if (!left || !right) {
            return;
        }

        return `${left} ${expression.operatorToken.getText()} ${right}`;
    }

    if (
        TS.isFunctionExpression(expression) ||
        TS.isArrowFunction(expression)
    ) {
        return normalizeWhitespace(expression.getText());
    }

    return normalizeWhitespace(expression.getText());
}

function normalizeObjectPropertyName(
    name: TS.PropertyName
): (string|undefined) {
    if (TS.isIdentifier(name) || TS.isPrivateIdentifier(name)) {
        return name.text;
    }

    if (TS.isNumericLiteral(name)) {
        return name.text;
    }

    if (TS.isStringLiteral(name)) {
        if (/^[A-Za-z_$][\w$]*$/u.test(name.text)) {
            return name.text;
        }

        return quoteString(name.text);
    }
}

function normalizeTextValue(text: string): (string|undefined) {
    const statement = parseSource(`const value = (${text});`).statements[0];

    if (
        !statement ||
        !TS.isVariableStatement(statement) ||
        !statement.declarationList.declarations.length
    ) {
        return;
    }

    const initializer = statement.declarationList.declarations[0].initializer;

    // Reject text the parser could not consume fully, e.g. `${palette.x}`
    if (
        !initializer ||
        !TS.isParenthesizedExpression(initializer) ||
        initializer.expression.getText() !== text
    ) {
        return;
    }

    return normalizeExpression(initializer);
}

function normalizeWhitespace(text: string): string {
    return text.replace(/\s+/gu, ' ').trim();
}

function quoteString(text: string): string {
    return `'${text
        .replace(/\\/gu, '\\\\')
        .replace(/'/gu, '\\\'')}'`;
}

function stringifyComment(
    comment: TS.JSDocTag['comment']
): string {
    if (typeof comment === 'string') {
        return comment.trim();
    }

    if (!comment) {
        return '';
    }

    return comment
        .map(part => ('text' in part ? part.text : ''))
        .join('')
        .trim();
}

function parseSource(code: string, fileName = 'test.ts'): TS.SourceFile {
    return TS.createSourceFile(
        fileName,
        code,
        TS.ScriptTarget.Latest,
        true,
        TS.ScriptKind.TS
    );
}

function readSource(path: string): TS.SourceFile {
    return parseSource(TS.sys.readFile(join(REPO_ROOT, path)) || '', path);
}

describe('Helper: normalizeTextValue', () => {
    it('normalizes primitive literals', () => {
        strictEqual(normalizeTextValue('true'), 'true');
        strictEqual(normalizeTextValue('false'), 'false');
        strictEqual(normalizeTextValue('null'), 'null');
        strictEqual(normalizeTextValue('undefined'), 'undefined');
        strictEqual(normalizeTextValue('42'), '42');
        strictEqual(normalizeTextValue('-1'), '-1');
    });

    it('normalizes string literals to single-quoted form', () => {
        strictEqual(normalizeTextValue("'hello'"), "'hello'");
        strictEqual(normalizeTextValue('"world"'), "'world'");
    });

    it('normalizes object literals, stripping quoted keys', () => {
        strictEqual(
            normalizeTextValue('{ "cursor": "pointer", "color": "#000" }'),
            "{ cursor: 'pointer', color: '#000' }"
        );
    });

    it('normalizes array literals', () => {
        strictEqual(normalizeTextValue('[1, 2, 3]'), '[1, 2, 3]');
        strictEqual(
            normalizeTextValue("['a', 'b']"),
            "['a', 'b']"
        );
    });

    it('returns undefined for text that is not a valid literal', () => {
        strictEqual(normalizeTextValue('${palette.backgroundColor}'), void 0);
        strictEqual(normalizeTextValue('10\nDesktop'), void 0);
        strictEqual(normalizeTextValue('%e %b %Y'), void 0);
    });
});

describe('Helper: collectDefaultTags', () => {
    it('collects @default from top-level interface properties', () => {
        const src = parseSource(`
            interface FooOptions {
                /** @default 'red' */
                color?: string;
                /** @default 10 */
                size?: number;
                noDefault?: boolean;
            }
        `);

        const defaults = collectDefaultTags(src, 'FooOptions');
        strictEqual(defaults.get('color'), "'red'");
        strictEqual(defaults.get('size'), '10');
        strictEqual(defaults.has('noDefault'), false);
    });

    it('collects @default from nested inline type literals', () => {
        const src = parseSource(`
            interface FooOptions {
                animation?: {
                    /** @default 500 */
                    duration?: number;
                    /** @default true */
                    enabled?: boolean;
                };
            }
        `);

        const defaults = collectDefaultTags(src, 'FooOptions');
        strictEqual(defaults.get('animation.duration'), '500');
        strictEqual(defaults.get('animation.enabled'), 'true');
    });

    it('skips @default with JSDoc type annotation pattern ({type} text)', () => {
        const src = parseSource(`
            interface FooOptions {
                /** @default {string} some-value */
                color?: string;
            }
        `);

        const defaults = collectDefaultTags(src, 'FooOptions');
        strictEqual(defaults.size, 0);
    });

    it('keeps @default that is not a valid literal as raw text', () => {
        const src = parseSource(
            'interface FooOptions {\n' +
            '    /** @default ${palette.backgroundColor} */\n' +
            '    color?: string;\n' +
            '}'
        );

        const defaults = collectDefaultTags(src, 'FooOptions');
        strictEqual(defaults.get('color'), '${palette.backgroundColor}');
    });
});

describe('Helper: collectTemplateDefaults', () => {
    it('finds @default with template expressions at any depth', () => {
        const src = parseSource(
            'interface FooOptions {\n' +
            '    style: CSSObject & {\n' +
            '        /** @default ${palette.neutralColor80} */\n' +
            '        color?: string;\n' +
            '    };\n' +
            "    /** @default 'var(--highcharts-background-color)' */\n" +
            '    backgroundColor?: string;\n' +
            '}'
        );

        strictEqual(
            collectTemplateDefaults(src).join(),
            'test.ts:3: @default ${palette.neutralColor80}'
        );
    });
});

describe('Helper: collectDefaultsFromObject', () => {
    it('collects top-level and nested property values', () => {
        const src = parseSource(`
            const FooDefaults: FooOptions = {
                enabled: true,
                size: 10,
                label: {
                    text: 'hello',
                    fontSize: 12
                }
            };
        `);

        const statement = src.statements[0] as TS.VariableStatement;
        const decl = statement.declarationList.declarations[0];
        const obj = decl.initializer as TS.ObjectLiteralExpression;
        const defaults = collectDefaultsFromObject(obj);

        strictEqual(defaults.get('enabled'), 'true');
        strictEqual(defaults.get('size'), '10');
        strictEqual(defaults.get('label'), "{ text: 'hello', fontSize: 12 }");
        strictEqual(defaults.get('label.text'), "'hello'");
        strictEqual(defaults.get('label.fontSize'), '12');
    });

    it('normalizes string values to single-quoted form', () => {
        const src = parseSource(`
            const FooDefaults: FooOptions = {
                mode: 'responsive',
                type: "line"
            };
        `);

        const statement = src.statements[0] as TS.VariableStatement;
        const decl = statement.declarationList.declarations[0];
        const obj = decl.initializer as TS.ObjectLiteralExpression;
        const defaults = collectDefaultsFromObject(obj);

        strictEqual(defaults.get('mode'), "'responsive'");
        strictEqual(defaults.get('type'), "'line'");
    });
});

describe('Helper: collectApiOptionDefaults', () => {
    it('collects @default by @apioption path, with multi-line values', () => {
        const src = parseSource(`
            const FooDefaults: FooOptions = {
                /**
                 * Bare text value.
                 *
                 * @type      {string}
                 * @default   y
                 * @apioption plotOptions.foo.onKey
                 */

                /**
                 * @default [
                 *     "#2caffe",
                 *     "#544fc5"
                 * ]
                 * @apioption plotOptions.foo.colors
                 */

                /**
                 * @apioption plotOptions.foo.noDefault
                 */
                enabled: true
            };
        `);

        const defaults = collectApiOptionDefaults(src);
        strictEqual(defaults.get('plotOptions.foo.onKey'), 'y');
        strictEqual(
            defaults.get('plotOptions.foo.colors'),
            "['#2caffe', '#544fc5']"
        );
        strictEqual(defaults.has('plotOptions.foo.noDefault'), false);
    });
});

describe('Helper: getDefaultsObjects', () => {
    it('reads @optionparent of the typed const', () => {
        const src = parseSource(`
            /**
             * @optionparent plotOptions.foo
             */
            const FooDefaults: FooOptions = {
                enabled: true
            };
        `);

        const foo = getDefaultsObjects(src).get('FooOptions');
        strictEqual(foo?.optionParent, 'plotOptions.foo');
        strictEqual(foo?.defaults.get('enabled'), 'true');
    });
});

describe('Helper: collectDefaultTags with paths', () => {
    it('collects the path of every inline member', () => {
        const src = parseSource(`
            interface FooOptions {
                /** @default true */
                enabled?: boolean;
                label?: {
                    text?: string;
                };
                style?: CSSObject;
            }
        `);

        const paths = new Set<string>();

        collectDefaultTags(src, 'FooOptions', paths);
        strictEqual(
            [...paths].join(),
            'enabled,label,label.text,style'
        );
    });
});

describe('Helper: getOptionsTypeName', () => {
    it('unwraps Partial and DeepPartial', () => {
        const src = parseSource(`
            const a: FooOptions = {};
            const b: Partial<FooOptions> = {};
            const c: DeepPartial<FooOptions> = {};
            const d: Record<string, FooOptions> = {};
        `);

        const names = src.statements.map(statement => getOptionsTypeName(
            (statement as TS.VariableStatement)
                .declarationList.declarations[0].type as TS.TypeNode
        ));

        strictEqual(names.join(), 'FooOptions,FooOptions,FooOptions,Record');
    });
});

describe('Helper: collectKnownDefaults', () => {
    it('merges Defaults values with @apioption defaults of the parent', () => {
        const known = collectKnownDefaults(
            {
                defaults: new Map([
                    ['enabled', 'true'],
                    ['label', "{ text: 'hello' }"],
                    ['label.text', "'hello'"]
                ]),
                optionParent: 'plotOptions.foo'
            },
            new Map([
                ['plotOptions.foo.size', '10'],
                ['plotOptions.bar.size', '20'],
                ['series.foo.size', '30']
            ])
        );

        strictEqual(
            [...known].map(entry => entry.join('=')).join(),
            "size=10,enabled=true,label.text='hello'"
        );
    });
});

describe('Helper: isSameDefault', () => {
    it('matches a quoted string with the same bare text', () => {
        strictEqual(isSameDefault("'chart'", 'chart'), true);
        strictEqual(isSameDefault('chart', "'chart'"), true);
        strictEqual(isSameDefault("'it\\'s'", "it's"), true);
    });

    it('does not match different values', () => {
        strictEqual(isSameDefault('80', '90'), false);
        strictEqual(isSameDefault("'chart'", "'map'"), false);
    });
});

interface PairedFilesResult {
    checksPerformed: number;
    failures: Array<string>;
    pairedCount: number;
    undocumented: Array<string>;
    unverified: Array<string>;
}

/**
 * Compares the Options files with their Defaults files. All checks on the
 * paired files share this result, so each file is read only once.
 */
function checkPairedFiles(optionsFiles: Array<string>): PairedFilesResult {
    const failures: Array<string> = [];
    const unverified: Array<string> = [];
    const undocumented: Array<string> = [];
    let checksPerformed = 0;
    let pairedCount = 0;

    for (const optionsPath of optionsFiles) {
        const defaultsPath = optionsPath.replace(
            /Options\.ts$/u,
            'Defaults.ts'
        );

        if (!existsSync(join(REPO_ROOT, defaultsPath))) {
            continue;
        }

        pairedCount++;

        const optionsSource = readSource(optionsPath);
        const defaultsSource = readSource(defaultsPath);
        const defaultsObjects = getDefaultsObjects(defaultsSource);
        const apiOptionDefaults = collectApiOptionDefaults(defaultsSource);

        for (const [interfaceName, defaultsObject] of defaultsObjects) {
            const {
                defaults: actualDefaults,
                optionParent
            } = defaultsObject;
            const memberPaths = new Set<string>();
            const docletDefaults = collectDefaultTags(
                optionsSource,
                interfaceName,
                memberPaths
            );

            for (const [path, value] of collectKnownDefaults(
                defaultsObject,
                apiOptionDefaults
            )) {
                // Members declared elsewhere, e.g. in a named type or a
                // parent interface, are not checked
                if (memberPaths.has(path) && !docletDefaults.has(path)) {
                    undocumented.push(
                        `${optionsPath} | ${interfaceName}.${path} | ` +
                        `missing @default ${value}`
                    );
                }
            }

            for (const [path, expected] of docletDefaults) {
                let actual = actualDefaults.get(path);
                let source = 'Defaults';

                if (typeof actual === 'undefined') {
                    const apiOption = optionParent &&
                        getPath(optionParent, path);

                    actual = apiOption ?
                        apiOptionDefaults.get(apiOption) :
                        void 0;
                    source = `@apioption ${apiOption}`;
                }

                if (typeof actual === 'undefined') {
                    unverified.push(
                        `${optionsPath} | ${interfaceName}.${path} | ` +
                        `@default ${expected} can't be verified: ` +
                        'property is neither set in Defaults nor ' +
                        'documented by @apioption'
                    );
                    continue;
                }

                checksPerformed++;

                if (!isSameDefault(actual, expected)) {
                    failures.push(
                        [
                            `${relative(REPO_ROOT, join(
                                REPO_ROOT,
                                optionsPath
                            ))}`,
                            `${interfaceName}.${path}`,
                            `expected @default ${expected}`,
                            `actual ${actual} (${source})`
                        ].join(' | ')
                    );
                }
            }
        }
    }

    return {
        checksPerformed,
        failures,
        pairedCount,
        undocumented,
        unverified
    };
}

describe('Options @default doclets', () => {
    const optionsFiles = glob.sync(OPTIONS_GLOB, {
        cwd: REPO_ROOT,
        ignore: IGNORE_GLOBS
    });
    let result: PairedFilesResult;

    before(() => {
        result = checkPairedFiles(optionsFiles);
    });

    it('should match paired defaults files', (t) => {
        const { checksPerformed, failures, pairedCount } = result;

        t.diagnostic(
            `Checked ${checksPerformed} @default doclet(s) across ` +
            `${optionsFiles.length} Options files ` +
            `(${pairedCount} paired with Defaults).`
        );

        strictEqual(failures.length, 0, failures.join('\n'));
    });

    it('should only have verifiable @default doclets', (t) => {
        const { unverified } = result;

        if (!STRICT) {
            if (unverified.length) {
                t.diagnostic(
                    `${unverified.length} @default doclet(s) can't be ` +
                    'verified: property is neither set in Defaults nor ' +
                    'documented by @apioption. ' +
                    'Set DEFAULT_DOCLETS_STRICT=1 to list them.'
                );
            }
            return;
        }

        strictEqual(unverified.length, 0, unverified.join('\n'));
    });

    it('should document defaults set in Defaults files', (t) => {
        const { undocumented } = result;

        if (!STRICT) {
            if (undocumented.length) {
                t.diagnostic(
                    `${undocumented.length} default(s) set in Defaults ` +
                    'have no @default doclet in Options. ' +
                    'Set DEFAULT_DOCLETS_STRICT=1 to list them.'
                );
            }
            return;
        }

        strictEqual(undocumented.length, 0, undocumented.join('\n'));
    });

    it('should not use template expressions', () => {
        const failures = optionsFiles.flatMap(
            optionsPath => collectTemplateDefaults(readSource(optionsPath))
        );

        strictEqual(failures.length, 0, failures.join('\n'));
    });
});
