/**
 * Checks that @default doclets on typed Options interface properties match the
 * values in the corresponding *Defaults.ts files.
 *
 * How it works:
 * - Scans `ts/**\/*Options.ts` files (excludes Dashboards, Grid, masters, .d.ts)
 * - For each Options file that has a matching `*Defaults.ts` sibling, finds all
 *   `const x: SomeType = { ... }` variable declarations in the Defaults file
 * - For each such typed const, looks up the interface with the same name in the
 *   Options file and collects @default doclets from its properties
 * - Reports mismatches between documented and actual defaults
 * - Separately, scans all Options files for @default doclets with template
 *   expressions (e.g. ${palette.*}), which are never valid default values
 * - Counts @default doclets whose property is not set in the Defaults const, as
 *   those can't be verified. To list them as failures, run from repo root:
 *   `DEFAULT_DOCLETS_STRICT=1 npx tsx --test test/ts-node-unit-tests/tests/default-doclets.test.ts`
 *
 * Limitations:
 * - Only checks properties that are explicitly set in the Defaults const; properties
 *   whose defaults come from parent merges or inheritance are not verified here
 * - Recurses only into inline type literals — does not follow named type references
 *   (e.g. a property typed as `SomeOtherOptions` won't have its members checked)
 * - @default doclets that are not valid TS literals are compared as raw text, so
 *   they only fail where the property is also set in the Defaults const
 */

import { describe, it } from 'node:test';
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

function collectDefaultTags(
    sourceFile: TS.SourceFile,
    interfaceName: string
): DefaultMap {
    const defaults: DefaultMap = new Map();

    for (const statement of sourceFile.statements) {
        if (
            TS.isInterfaceDeclaration(statement) &&
            statement.name.text === interfaceName
        ) {
            collectMembers(defaults, statement.members, '');
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
    prefix: string
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

        if (docletDefault) {
            defaults.set(path, docletDefault);
        }

        collectTypeMembers(defaults, member.type, path);
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
    prefix: string
): void {
    if (TS.isParenthesizedTypeNode(typeNode)) {
        collectTypeMembers(defaults, typeNode.type, prefix);
        return;
    }

    if (TS.isTypeLiteralNode(typeNode)) {
        collectMembers(defaults, typeNode.members, prefix);
        return;
    }

    if (
        TS.isIntersectionTypeNode(typeNode) ||
        TS.isUnionTypeNode(typeNode)
    ) {
        for (const nestedType of typeNode.types) {
            collectTypeMembers(defaults, nestedType, prefix);
        }
    }
}

function getDefaultsObjects(sourceFile: TS.SourceFile): Map<string, DefaultMap> {
    const defaults = new Map<string, DefaultMap>();

    for (const statement of sourceFile.statements) {
        if (!TS.isVariableStatement(statement)) {
            continue;
        }

        for (const declaration of statement.declarationList.declarations) {
            if (
                !TS.isIdentifier(declaration.name) ||
                !declaration.type ||
                !TS.isTypeReferenceNode(declaration.type) ||
                !TS.isIdentifier(declaration.type.typeName) ||
                !declaration.initializer ||
                !TS.isObjectLiteralExpression(declaration.initializer)
            ) {
                continue;
            }

            defaults.set(
                declaration.type.typeName.text,
                collectDefaultsFromObject(declaration.initializer)
            );
        }
    }

    return defaults;
}

function getDocletDefault(node: TS.Node): (string|undefined) {
    const defaultTag = TS.getJSDocTags(node)
        .find(tag => tag.tagName.text === 'default');

    if (!defaultTag) {
        return;
    }

    const comment = stringifyComment(defaultTag.comment);

    if (
        !comment ||
        /^\{[a-z|]+\}\s/u.test(comment)
    ) {
        return;
    }

    return normalizeTextValue(comment) ?? comment;
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

describe('Options @default doclets', () => {
    const optionsFiles = glob.sync(OPTIONS_GLOB, {
        cwd: REPO_ROOT,
        ignore: IGNORE_GLOBS
    });

    it('should match paired defaults files', (t) => {
        const failures: Array<string> = [];
        const unverified: Array<string> = [];
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
            const defaultsObjects = getDefaultsObjects(
                readSource(defaultsPath)
            );

            for (const [interfaceName, actualDefaults] of defaultsObjects) {
                const docletDefaults = collectDefaultTags(
                    optionsSource,
                    interfaceName
                );

                for (const [path, expected] of docletDefaults) {
                    if (!actualDefaults.has(path)) {
                        unverified.push(
                            `${optionsPath} | ${interfaceName}.${path} | ` +
                            `@default ${expected} can't be verified: ` +
                            'property is not set in Defaults'
                        );
                        continue;
                    }

                    checksPerformed++;
                    const actual = actualDefaults.get(path);

                    if (actual !== expected) {
                        failures.push(
                            [
                                `${relative(REPO_ROOT, join(
                                    REPO_ROOT,
                                    optionsPath
                                ))}`,
                                `${interfaceName}.${path}`,
                                `expected @default ${expected}`,
                                `actual ${actual}`
                            ].join(' | ')
                        );
                    }
                }
            }
        }

        t.diagnostic(
            `Checked ${checksPerformed} @default doclet(s) across ` +
            `${optionsFiles.length} Options files ` +
            `(${pairedCount} paired with Defaults).`
        );

        if (STRICT) {
            failures.push(...unverified);
        } else if (unverified.length) {
            t.diagnostic(
                `${unverified.length} @default doclet(s) can't be verified: ` +
                'property is not set in Defaults. ' +
                'Set DEFAULT_DOCLETS_STRICT=1 to list them.'
            );
        }

        strictEqual(failures.length, 0, failures.join('\n'));
    });

    it('should not use template expressions', () => {
        const failures = optionsFiles.flatMap(
            optionsPath => collectTemplateDefaults(readSource(optionsPath))
        );

        strictEqual(failures.length, 0, failures.join('\n'));
    });
});
