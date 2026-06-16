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

        if (
            prefix &&
            docletDefault
        ) {
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

    return normalizeTextValue(comment);
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
        const value = normalizeExpression(expression.operand);

        return value ? `${expression.operator}${value}` : void 0;
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
    const sourceFile = TS.createSourceFile(
        'default-doclet.ts',
        `const value = (${text});`,
        TS.ScriptTarget.Latest,
        true,
        TS.ScriptKind.TS
    );
    const statement = sourceFile.statements[0];

    if (
        !statement ||
        !TS.isVariableStatement(statement) ||
        !statement.declarationList.declarations.length
    ) {
        return;
    }

    const declaration = statement.declarationList.declarations[0];

    if (!declaration.initializer) {
        return;
    }

    return normalizeExpression(declaration.initializer);
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

describe('Options @default doclets', () => {
    it('should match paired defaults files', () => {
        const failures: Array<string> = [];
        const optionsFiles = glob.sync(OPTIONS_GLOB, {
            cwd: REPO_ROOT,
            ignore: IGNORE_GLOBS
        });

        for (const optionsPath of optionsFiles) {
            const defaultsPath = optionsPath.replace(
                /Options\.ts$/u,
                'Defaults.ts'
            );

            if (!existsSync(join(REPO_ROOT, defaultsPath))) {
                continue;
            }

            const optionsSource = TS.createSourceFile(
                optionsPath,
                TS.sys.readFile(join(REPO_ROOT, optionsPath)) || '',
                TS.ScriptTarget.Latest,
                true,
                TS.ScriptKind.TS
            );
            const defaultsSource = TS.createSourceFile(
                defaultsPath,
                TS.sys.readFile(join(REPO_ROOT, defaultsPath)) || '',
                TS.ScriptTarget.Latest,
                true,
                TS.ScriptKind.TS
            );
            const defaultsObjects = getDefaultsObjects(defaultsSource);

            for (const [interfaceName, actualDefaults] of defaultsObjects) {
                const docletDefaults = collectDefaultTags(
                    optionsSource,
                    interfaceName
                );

                for (const [path, expected] of docletDefaults) {
                    const actual = actualDefaults.get(path);

                    if (
                        typeof actual === 'undefined' &&
                        expected === 'undefined'
                    ) {
                        continue;
                    }

                    if (actual !== expected) {
                        failures.push(
                            [
                                `${relative(REPO_ROOT, join(
                                    REPO_ROOT,
                                    optionsPath
                                ))}`,
                                `${interfaceName}.${path}`,
                                `expected @default ${expected}`,
                                `actual ${actual ?? '[missing]'}`
                            ].join(' | ')
                        );
                    }
                }
            }
        }

        strictEqual(failures.length, 0, failures.join('\n'));
    });
});
