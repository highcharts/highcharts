import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { describe, it } from 'node:test';
import Path from 'node:path';
import { createRequire } from 'node:module';
import {
    createReactStaticFixture,
    EXPECTED_VERSIONS
} from './fixtures/reactStatic.mjs';

const require = createRequire(import.meta.url);
const ReactStatic = require('../gulptasks/lib/reactStatic.js');
const { runApiDocs } = require('../gulptasks/api-docs.js');

function createDependencies(calls) {
    return {
        processLib: {
            async execFile(file, args) {
                calls.push(args.includes('tools/api-docs/api-classes.ts') ? 'classes' : 'options');
            }
        },
        reactStatic: {
            async verifyArtifact(...args) {
                calls.push('verify');
                return ReactStatic.verifyArtifact(...args);
            },
            async validateStagingRoots(...args) {
                calls.push('validate');
                return ReactStatic.validateStagingRoots(...args);
            },
            async stageArtifact(...args) {
                calls.push('stage');
                return ReactStatic.stageArtifact(...args);
            }
        },
        createApiDocumentation() {
            calls.push('generate');
        }
    };
}

describe('api-docs source arguments', () => {
    for (const source of ['docs with spaces/$(printf unexpected)', '`printf unexpected`']) {
        it(`passes ${String(source)} as one literal source argument`, async () => {
            const calls = [];
            await runApiDocs({ source }, {
                processLib: {
                    async execFile(file, args) {
                        calls.push([file, ...args]);
                    }
                },
                createApiDocumentation() {
                    calls.push('generate');
                }
            });
            assert.deepEqual(calls, [
                [process.execPath, '--import', 'tsx', 'tools/api-docs/api-classes.ts',
                    '--source', String(source || 'ts')],
                [process.execPath, '--import', 'tsx', 'tools/api-docs/api-options.ts',
                    '--source', String(source || 'ts')],
                'generate'
            ]);
        });
    }
});

function artifactArgs(fixture) {
    return {
        reactArtifact: fixture.artifactDirectory,
        ...EXPECTED_VERSIONS
    };
}

describe('api-docs React artifact staging', () => {
    it('rejects overlapping roots before generators and leaves the verified artifact untouched', async () => {
        const fixture = await createReactStaticFixture();
        const calls = [];
        const nestedStage = Path.join(fixture.artifactDirectory, 'nested-stage');
        const artifactPaths = [
            'react-static-manifest.json',
            'react-static-files.jsonl',
            ...fixture.records.map(record => record.path)
        ];

        try {
            const before = await Promise.all(artifactPaths.map(file =>
                readFile(Path.join(fixture.artifactDirectory, file))));

            await assert.rejects(
                runApiDocs(artifactArgs(fixture), {
                    ...createDependencies(calls),
                    targetDirectory: nestedStage
                }),
                /artifact and staging directories must not overlap/u
            );

            assert.deepEqual(calls, ['verify', 'validate']);
            await assert.rejects(readdir(nestedStage), { code: 'ENOENT' });
            assert.deepEqual(
                await Promise.all(artifactPaths.map(file =>
                    readFile(Path.join(fixture.artifactDirectory, file)))),
                before
            );
            await ReactStatic.verifyArtifact(fixture.artifactDirectory, EXPECTED_VERSIONS);
        } finally {
            await fixture.cleanup();
        }
    });

    it('validates separate roots before preserving API generation and staging order', async () => {
        const fixture = await createReactStaticFixture();
        const calls = [];

        try {
            await runApiDocs(artifactArgs(fixture), {
                ...createDependencies(calls),
                targetDirectory: fixture.stagingDirectory
            });

            assert.deepEqual(calls, [
                'verify',
                'validate',
                'classes',
                'options',
                'generate',
                'stage'
            ]);
            assert.equal(
                await readFile(
                    Path.join(fixture.stagingDirectory, 'highcharts/react/index.html'),
                    'utf8'
                ),
                fixture.contents.get('highcharts/react/index.html').toString()
            );
        } finally {
            await fixture.cleanup();
        }
    });
});
