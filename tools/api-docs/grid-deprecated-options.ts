/* *
 *
 *  Creating Grid deprecated runtime metadata from TypeScript doclets.
 *
 *  (c) Highsoft AS
 * 
 *  Authors:
 *  - Dawid Dragula
 * 
 * */


/* *
 *
 *  Imports
 *
 * */


import FS from 'node:fs';
import * as Path from 'node:path';

import LogLib from '../libs/log.js';
import TreeLib from '../libs/tree.js';
import Yargs from 'yargs';

import {
    buildGridOptionsTree,
    getRuntimeBranchMetadata
} from './grid-options';


/* *
 *
 *  Declarations
 *
 * */

interface Args {
    debug?: boolean;
    output?: string;
    source?: string;
}

interface DeprecatedOptionPropertySegment {
    kind: 'property';
    name: string;
}

interface DeprecatedOptionDiscriminatorSegment {
    allowUndefined?: boolean;
    kind: 'discriminator';
    name: string;
    value: string;
}

interface DeprecatedOptionMetadata {
    docsPath: string;
    runtimePath: string;
    segments: Array<
        DeprecatedOptionDiscriminatorSegment |
        DeprecatedOptionPropertySegment
    >;
    text: string;
}


/* *
 *
 *  Constants
 *
 * */

const DEFAULT_OUTPUT = Path.resolve(
    'ts/Grid/Core/DeprecatedOptionsMetadata.ts'
);


/* *
 *
 *  Functions
 *
 * */

function collectDeprecatedOptions(
    tree: TreeLib.Options
): Array<DeprecatedOptionMetadata> {
    const deprecatedOptions: Array<DeprecatedOptionMetadata> = [];

    const visit = (
        nodes: TreeLib.Options,
        parentDocsPath = '',
        parentRuntimePath = '',
        parentSegments: DeprecatedOptionMetadata['segments'] = []
    ): void => {
        const nodeNames = Object.keys(nodes)
            .filter((name): boolean => name !== '_meta')
            .sort();

        for (const nodeName of nodeNames) {
            const node = nodes[nodeName];
            const docsPath = parentDocsPath ?
                `${parentDocsPath}.${nodeName}` :
                nodeName;
            const branchMetadata = getRuntimeBranchMetadata(node);
            const deprecatedText = normalizeDocletText(
                node.doclet?.deprecated
            );
            let runtimePath = parentRuntimePath ?
                `${parentRuntimePath}.${nodeName}` :
                nodeName;
            let segments = parentSegments.concat({
                kind: 'property',
                name: nodeName
            });

            if (branchMetadata) {
                const { discriminator, runtimeBasePath } = branchMetadata;

                runtimePath = runtimeBasePath;
                segments = parentSegments.concat({
                    allowUndefined: discriminator.allowUndefined,
                    kind: 'discriminator',
                    name: discriminator.property,
                    value: discriminator.value
                });
            }

            if (typeof deprecatedText !== 'undefined') {
                deprecatedOptions.push({
                    docsPath,
                    runtimePath,
                    segments,
                    text: deprecatedText
                });
            }

            if (node.children) {
                visit(node.children, docsPath, runtimePath, segments);
            }
        }
    };

    visit(tree);

    return deprecatedOptions.sort(
        (
            left: DeprecatedOptionMetadata,
            right: DeprecatedOptionMetadata
        ): number => (
            left.docsPath.localeCompare(right.docsPath) ||
            left.runtimePath.localeCompare(right.runtimePath)
        )
    );
}

function normalizeDocletText(value: unknown): string | undefined {
    const normalizeText = (text: string): string => (
        text.replace(
            /\{@link\s+([^}\s|]+)(?:\s*\|\s*([^}]+)|\s+([^}]+))?\}/gu,
            (
                _match,
                target: string,
                pipeLabel?: string,
                spaceLabel?: string
            ) => (pipeLabel || spaceLabel || target).trim()
        ).trim()
    );

    if (Array.isArray(value)) {
        const text = value
            .map((item): string => `${item}`.trim())
            .filter(Boolean)
            .join('\n\n')
            .trim();

        return normalizeText(text) || '';
    }

    if (typeof value === 'string') {
        return normalizeText(value);
    }

    if (typeof value === 'boolean') {
        return '';
    }

    return void 0;
}

function stringifySingleQuoted(value: string): string {
    return `'${value
        .replace(/\\/gu, '\\\\')
        .replace(/'/gu, '\\\'')}'`;
}

function serializeLiteral(
    value: Array<unknown> | Record<string, unknown> | string | boolean,
    indentLevel = 0
): string {
    if (typeof value === 'boolean') {
        return `${value}`;
    }

    if (typeof value === 'string') {
        return stringifySingleQuoted(value);
    }

    if (Array.isArray(value)) {
        if (!value.length) {
            return '[]';
        }

        const indent = '    '.repeat(indentLevel);
        const childIndent = '    '.repeat(indentLevel + 1);
        const serializedEntries = value.map(
            (entryValue): string => `${childIndent}${serializeLiteral(
                entryValue as
                    Array<unknown> |
                    Record<string, unknown> |
                    string |
                    boolean,
                indentLevel + 1
            )}`
        );

        return `[\n${serializedEntries.join(',\n')}\n${indent}]`;
    }

    const indent = '    '.repeat(indentLevel);
    const childIndent = '    '.repeat(indentLevel + 1);
    const entries = Object.entries(value);

    if (!entries.length) {
        return '{}';
    }

    const serializedEntries = entries.map(
        ([key, entryValue]): string => `${childIndent}${stringifySingleQuoted(
            key
        )}: ${serializeLiteral(
            entryValue as
                Array<unknown> |
                Record<string, unknown> |
                string |
                boolean,
            indentLevel + 1
        )}`
    );

    return `{\n${serializedEntries.join(',\n')}\n${indent}}`;
}

function renderMetadataModule(
    deprecatedOptions: Array<DeprecatedOptionMetadata>
): string {
    const serialized = serializeLiteral(deprecatedOptions);

    return `/* *
 *
 *  Grid deprecated runtime metadata
 *
 *  WARNING: This file is generated by \`npx gulp grid/deprecated-options\`.
 *  Do not edit this file manually.
 *
 * */

'use strict';

interface DeprecatedOptionPropertySegment {
    kind: 'property';
    name: string;
}

interface DeprecatedOptionDiscriminatorSegment {
    allowUndefined?: boolean;
    kind: 'discriminator';
    name: string;
    value: string;
}

type DeprecatedOptionMatchSegment =
    DeprecatedOptionDiscriminatorSegment |
    DeprecatedOptionPropertySegment;

interface DeprecatedOptionMetadata {
    docsPath: string;
    runtimePath: string;
    segments: Array<DeprecatedOptionMatchSegment>;
    text: string;
}

const deprecatedOptionsMetadata: Array<DeprecatedOptionMetadata> = ${serialized};

export type { DeprecatedOptionMatchSegment, DeprecatedOptionMetadata };
export { deprecatedOptionsMetadata };
`;
}

async function main(): Promise<void> {
    const args = Yargs.parseSync(process.argv) as Args;
    const outputPath = args.output || DEFAULT_OUTPUT;
    const tree = await buildGridOptionsTree(args);
    const deprecatedOptions = collectDeprecatedOptions(tree);

    FS.mkdirSync(Path.dirname(outputPath), { recursive: true });
    FS.writeFileSync(
        outputPath,
        renderMetadataModule(deprecatedOptions),
        'utf8'
    );

    LogLib.success(
        'Saved',
        outputPath,
        `(${deprecatedOptions.length} deprecated options).`
    );
}


/* *
 *
 *  Runtime
 *
 * */


void main();
