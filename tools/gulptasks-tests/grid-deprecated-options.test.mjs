import { describe, it } from 'node:test';
import { deepStrictEqual, strictEqual } from 'node:assert';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    getGitOutput,
    getStagedMetadataFilesFromOutput,
    getUnstagedMetadataInputFilesFromStatus,
    parseGitStatus
} = require('../gulptasks/grid/deprecated-options.js');

describe('grid/deprecated-options git status parsing', () => {
    it('parses renamed paths from porcelain output', () => {
        deepStrictEqual(
            parseGitStatus(
                'R  ts/Grid/Old.ts -> ts/Grid/New.ts\n' +
                ' M ts/Grid/Core/Defaults.ts\n'
            ),
            [{
                filePath: 'ts/Grid/New.ts',
                status: 'R '
            }, {
                filePath: 'ts/Grid/Core/Defaults.ts',
                status: ' M'
            }]
        );
    });

    it('detects staged files that should regenerate metadata', () => {
        deepStrictEqual(
            getStagedMetadataFilesFromOutput(
                'docs/article.md\n' +
                'tools/api-docs/grid-options.ts\n' +
                'ts/Grid/Core/DeprecatedOptionsMetadata.ts\n' +
                'ts/Grid/Core/Options.ts\n'
            ),
            [
                'tools/api-docs/grid-options.ts',
                'ts/Grid/Core/DeprecatedOptionsMetadata.ts',
                'ts/Grid/Core/Options.ts'
            ]
        );
    });

    it('allows optional git checks to fail without blocking generation', () => {
        strictEqual(
            getGitOutput(['not-a-real-git-subcommand'], true),
            ''
        );
    });

    it('detects unstaged metadata inputs but ignores generated metadata', () => {
        deepStrictEqual(
            getUnstagedMetadataInputFilesFromStatus(
                'M  ts/Grid/Core/Options.ts\n' +
                ' M ts/Grid/Core/Defaults.ts\n' +
                '?? ts/Grid/Core/NewOptions.ts\n' +
                ' M ts/Grid/Core/DeprecatedOptionsMetadata.ts\n' +
                ' M docs/article.md\n'
            ),
            [
                'ts/Grid/Core/Defaults.ts',
                'ts/Grid/Core/NewOptions.ts'
            ]
        );
    });
});
