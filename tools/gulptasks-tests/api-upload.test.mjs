import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    getReactArtifactInput,
    normalizeDocs,
    runApiUpload
} = require('../gulptasks/api-upload.js');
const {
    isReactOwnedKey,
    preparePublicationReport
} = require('../gulptasks/lib/reactStatic.js');

async function createSourceRoot() {
    const root = await mkdtemp(join(tmpdir(), 'highcharts-api-upload-'));
    await mkdir(join(root, 'highcharts'), { recursive: true });
    await mkdir(join(root, 'react-assets'), { recursive: true });
    await mkdir(join(root, 'react-data'), { recursive: true });
    await writeFile(join(root, 'react-static-manifest.json'), '{}');
    await writeFile(join(root, 'react-static-files.jsonl'), '{}\n');

    return root;
}

function createDependencies(sourceRoot, calls, options = {}) {
    const session = {
        bucket: 'test-bucket',
        dryrun: true,
        region: {
            destroy() {
                calls.push('destroy');
            }
        }
    };

    return {
        sourceRoot,
        reactStatic: {
            isReactOwnedKey,
            async verifyArtifact(directory, versions) {
                calls.push(['verify', directory, versions]);
                if (options.verifyError) {
                    throw options.verifyError;
                }
                return { root: directory, manifest: {}, records: [] };
            },
            async stageArtifact(artifact, targetRoot, stageOptions) {
                calls.push(['stage', artifact, targetRoot, stageOptions]);
                return { ...artifact, root: targetRoot };
            },
            async preparePublicationReport(artifact, reportPath) {
                calls.push(['report', artifact, reportPath]);
            },
            async publishArtifact(artifact, activeSession, publishOptions) {
                calls.push([
                    'publish',
                    artifact,
                    activeSession,
                    publishOptions
                ]);
            }
        },
        uploadS3: {
            async startS3Session(...args) {
                calls.push(['session', ...args]);
                return session;
            },
            async uploadFile(...args) {
                calls.push(['file', ...args]);
            },
            async uploadDirectory(...args) {
                calls.push(['upload', ...args]);
            },
            async synchronizeDirectory(...args) {
                calls.push(['sync', ...args]);
            }
        }
    };
}

describe('api-upload task integration', () => {
    it('rejects combined sync with absent or React-only legacy output before staging or S3', async () => {
        const sourceRoot = await createSourceRoot();
        const calls = [];
        const args = {
            bucket: 'test-bucket', sync: true, reactArtifact: '/tmp/react-static',
            expectedHighchartsVersion: '13.1.1', expectedReactVersion: '5.0.1'
        };
        try {
            await assert.rejects(runApiUpload(args, createDependencies(sourceRoot, calls)), /Legacy API build missing/u);
            assert.deepEqual(calls, []);
            await rm(sourceRoot, { recursive: true, force: true });
            await assert.rejects(runApiUpload(args, createDependencies(sourceRoot, calls)), /Source directory/u);
            assert.deepEqual(calls, []);
        } finally {
            await rm(sourceRoot, { recursive: true, force: true });
        }
    });

    it('allows combined sync with generated legacy output and retains navigation after publication', async () => {
        const sourceRoot = await createSourceRoot();
        const calls = [];
        try {
            await writeFile(join(sourceRoot, 'highcharts/api.js'), 'legacy');
            await writeFile(join(sourceRoot, 'highcharts/index.html'), 'legacy');
            const dependencies = createDependencies(sourceRoot, calls);
            const stage = dependencies.reactStatic.stageArtifact;
            dependencies.reactStatic.stageArtifact = async (...args) => {
                for (const product of ['highstock', 'highmaps', 'gantt']) {
                    await mkdir(join(sourceRoot, product, 'react'), { recursive: true });
                }
                return stage(...args);
            };
            await runApiUpload({
                bucket: 'test-bucket', sync: true,
                reactArtifact: '/tmp/react-static',
                expectedHighchartsVersion: '13.1.1', expectedReactVersion: '5.0.1'
            }, dependencies);
            assert.equal(calls.filter(call => call[0] === 'sync').length, 1);
            assert.equal(calls.find(call => call[0] === 'sync')[2], 'highcharts');
            const filter = calls.find(call => call[0] === 'sync')[4];
            const staged = Buffer.from('legacy\n/* React API navigation */\nlink');
            assert.deepEqual(filter(join(sourceRoot, 'highcharts/api.js'), staged), staged);
            assert.ok(calls.findIndex(call => call[0] === 'publish') < calls.findIndex(call => call[0] === 'sync'));
        } finally {
            await rm(sourceRoot, { recursive: true, force: true });
        }
    });

    it('strips staged React navigation from legacy-only uploads', async () => {
        const sourceRoot = await createSourceRoot();
        const calls = [];
        try {
            await runApiUpload({ bucket: 'test-bucket', docs: 'highcharts' }, createDependencies(sourceRoot, calls));
            const filter = calls.find(call => call[0] === 'upload')[4];
            const original = Buffer.from('window.legacy = true;\n');
            const staged = Buffer.concat([original, Buffer.from('\n/* React API navigation */\n(function () {})();\n')]);
            assert.deepEqual(filter(join(sourceRoot, 'highcharts/api.js'), staged), original);
            assert.deepEqual(filter(join(sourceRoot, 'highcharts/api.js'), original), original);
        } finally {
            await rm(sourceRoot, { recursive: true, force: true });
        }
    });

    it('normalizes Windows selections and rejects traversal or owned paths', () => {
        assert.deepEqual(
            normalizeDocs('highcharts\\api', isReactOwnedKey),
            ['highcharts/api']
        );

        assert.throws(
            () => normalizeDocs('../outside', isReactOwnedKey),
            /Invalid --docs path/u
        );
        assert.throws(
            () => normalizeDocs('highcharts/react', isReactOwnedKey),
            /React-owned path/u
        );
        assert.throws(
            () => normalizeDocs('react-assets', isReactOwnedKey),
            /React-owned path/u
        );
        assert.throws(
            () => normalizeDocs('react-static-manifest.json', isReactOwnedKey),
            /React-owned path/u
        );
    });

    it('requires an artifact path and both version expectations together', () => {
        assert.throws(
            () => getReactArtifactInput({ reactArtifact: '' }, {
                allowShellsOnly: true
            }),
            /requires --expected-react-version/u
        );
        assert.throws(
            () => getReactArtifactInput({
                expectedHighchartsVersion: '13.1.1'
            }, { allowShellsOnly: true }),
            /require --react-artifact/u
        );
        assert.throws(
            () => getReactArtifactInput({
                reactArtifact: '/tmp/artifact',
                expectedReactVersion: '5.0.1'
            }, { allowShellsOnly: true }),
            /requires --expected-react-version and --expected-highcharts-version/u
        );
    });

    it('requires a React artifact for react-only and rejects conflicting modes', async () => {
        const sourceRoot = await createSourceRoot();
        const calls = [];
        const dependencies = createDependencies(sourceRoot, calls);

        try {
            await assert.rejects(
                runApiUpload(
                    {
                        bucket: 'test-bucket',
                        dryrun: true,
                        reactOnly: true
                    },
                    dependencies
                ),
                /React artifact options require --react-artifact/u
            );

            await assert.rejects(
                runApiUpload(
                    {
                        bucket: 'test-bucket',
                        dryrun: true,
                        expectedHighchartsVersion: '13.1.1',
                        expectedReactVersion: '5.0.1',
                        reactArtifact: '/tmp/react-static',
                        reactOnly: true,
                        reactShellsOnly: true
                    },
                    dependencies
                ),
                /cannot be combined/u
            );

            assert.deepEqual(calls, []);
        } finally {
            await rm(sourceRoot, { recursive: true, force: true });
        }
    });

    it('rejects direct React docs selections before verification or S3', async () => {
        const sourceRoot = await createSourceRoot();
        const calls = [];

        try {
            await assert.rejects(
                runApiUpload(
                    {
                        bucket: 'test-bucket',
                        dryrun: true,
                        docs: 'highcharts/react',
                        expectedHighchartsVersion: '13.1.1',
                        expectedReactVersion: '5.0.1',
                        reactArtifact: '/tmp/react-static'
                    },
                    createDependencies(sourceRoot, calls)
                ),
                /React-owned path/u
            );

            assert.deepEqual(calls, []);
        } finally {
            await rm(sourceRoot, { recursive: true, force: true });
        }
    });

    it('filters React-owned roots during legacy synchronization', async () => {
        const sourceRoot = await createSourceRoot();
        const calls = [];

        try {
            await runApiUpload(
                {
                    bucket: 'test-bucket',
                    docs: 'highcharts',
                    dryrun: true,
                    sync: true
                },
                createDependencies(sourceRoot, calls)
            );

            const syncCall = calls.find(call => call[0] === 'sync');
            assert.ok(syncCall, 'legacy sync should run for selected docs');
            assert.equal(syncCall[1], join(sourceRoot, 'highcharts'));
            assert.equal(syncCall[2], 'highcharts');
            assert.equal(typeof syncCall[5], 'function');
            assert.equal(syncCall[5]('highcharts/api/index.html'), true);
            assert.equal(syncCall[5]('highcharts/react/index.html'), false);
            assert.equal(syncCall[5]('react-assets/v1/app.js'), false);
            assert.ok(calls.includes('destroy'));
        } finally {
            await rm(sourceRoot, { recursive: true, force: true });
        }
    });

    it('skips shared React roots in a default legacy upload', async () => {
        const sourceRoot = await createSourceRoot();
        const calls = [];

        try {
            await runApiUpload(
                { bucket: 'test-bucket', dryrun: true },
                createDependencies(sourceRoot, calls)
            );

            const uploadedKeys = calls
                .filter(call => Array.isArray(call) && call[0] === 'upload')
                .map(call => call[2]);
            assert.ok(uploadedKeys.includes('highcharts'));
            assert.equal(uploadedKeys.includes('react-assets'), false);
            assert.equal(uploadedKeys.includes('react-data'), false);
            assert.equal(calls.some(call => (
                Array.isArray(call) && call[0] === 'file'
            )), false);
        } finally {
            await rm(sourceRoot, { recursive: true, force: true });
        }
    });

    it('verifies and stages before opening S3, then publishes React before legacy docs', async () => {
        const sourceRoot = await createSourceRoot();
        const calls = [];

        try {
            await runApiUpload(
                {
                    bucket: 'test-bucket',
                    dryrun: true,
                    expectedHighchartsVersion: '13.1.1',
                    expectedReactVersion: '5.0.1',
                    reactArtifact: '/tmp/react-static',
                    reactReport: 'tmp/react-report.json'
                },
                createDependencies(sourceRoot, calls)
            );

            const kinds = calls.map(call => {
                if (Array.isArray(call)) {
                    return call[0];
                }

                return call;
            });
            assert.ok(kinds.indexOf('verify') < kinds.indexOf('stage'));
            assert.ok(kinds.indexOf('stage') < kinds.indexOf('session'));
            assert.ok(kinds.indexOf('session') < kinds.indexOf('publish'));
            assert.ok(kinds.indexOf('publish') < kinds.indexOf('upload'));

            const verifyCall = calls.find(call => call[0] === 'verify');
            assert.equal(verifyCall[1], resolve('/tmp/react-static'));
            assert.deepEqual(verifyCall[2], {
                expectedHighchartsVersion: '13.1.1',
                expectedReactVersion: '5.0.1'
            });

            const publishCall = calls.find(call => call[0] === 'publish');
            assert.deepEqual(publishCall[3], {
                shellsOnly: false,
                reportPath: resolve('tmp/react-report.json')
            });
        } finally {
            await rm(sourceRoot, { recursive: true, force: true });
        }
    });

    it('publishes only React files without changing navigation or running legacy upload/sync', async () => {
        const sourceRoot = await createSourceRoot();
        const calls = [];

        try {
            await runApiUpload(
                {
                    bucket: 'test-bucket',
                    docs: 'highcharts/react',
                    dryrun: true,
                    expectedHighchartsVersion: '13.1.1',
                    expectedReactVersion: '5.0.1',
                    reactArtifact: '/tmp/react-static',
                    reactOnly: true,
                    sync: true
                },
                createDependencies(sourceRoot, calls)
            );

            const kinds = calls.map(call => (
                Array.isArray(call) ? call[0] : call
            ));
            const stageCall = calls.find(call => call[0] === 'stage');
            const publishCall = calls.find(call => call[0] === 'publish');

            assert.ok(stageCall, 'React artifact should be staged');
            assert.ok(publishCall, 'React artifact should be published');
            assert.ok(kinds.indexOf('verify') < kinds.indexOf('stage'));
            assert.ok(kinds.indexOf('stage') < kinds.indexOf('session'));
            assert.ok(kinds.indexOf('session') < kinds.indexOf('publish'));
            assert.deepEqual(stageCall[3], { addNavigation: false });
            assert.deepEqual(publishCall[3], {
                shellsOnly: false,
                reportPath: void 0
            });
            assert.equal(calls.some(call => (
                Array.isArray(call) &&
                ['file', 'upload', 'sync'].includes(call[0])
            )), false);
            assert.ok(calls.includes('destroy'));
        } finally {
            await rm(sourceRoot, { recursive: true, force: true });
        }
    });

    it('limits rollback to React shells and skips every legacy operation', async () => {
        const sourceRoot = await createSourceRoot();
        const calls = [];

        try {
            await runApiUpload(
                {
                    bucket: 'test-bucket',
                    dryrun: true,
                    expectedHighchartsVersion: '13.1.1',
                    expectedReactVersion: '5.0.1',
                    reactArtifact: '/tmp/retained-react-static',
                    reactShellsOnly: true,
                    sync: true
                },
                createDependencies(sourceRoot, calls)
            );

            assert.equal(calls.some(call => (
                Array.isArray(call) &&
                ['file', 'upload', 'sync'].includes(call[0])
            )), false);
            assert.equal(calls.filter(call => (
                Array.isArray(call) && call[0] === 'publish'
            )).length, 1);
            assert.deepEqual(
                calls.find(call => call[0] === 'publish')[3],
                { shellsOnly: true, reportPath: void 0 }
            );
            assert.ok(calls.includes('destroy'));
        } finally {
            await rm(sourceRoot, { recursive: true, force: true });
        }
    });

    it('does not create an S3 session when artifact verification fails', async () => {
        const sourceRoot = await createSourceRoot();
        const calls = [];
        const verifyError = new Error('invalid artifact');

        try {
            await assert.rejects(
                runApiUpload(
                    {
                        bucket: 'test-bucket',
                        dryrun: true,
                        expectedHighchartsVersion: '13.1.1',
                        expectedReactVersion: '5.0.1',
                        reactArtifact: '/tmp/invalid-react-static'
                    },
                    createDependencies(sourceRoot, calls, { verifyError })
                ),
                verifyError
            );

            assert.equal(calls.some(call => (
                Array.isArray(call) && call[0] === 'session'
            )), false);
            assert.equal(calls.some(call => (
                Array.isArray(call) && call[0] === 'stage'
            )), false);
        } finally {
            await rm(sourceRoot, { recursive: true, force: true });
        }
    });

    it('rejects invalid report destinations before the S3 session or legacy upload', async () => {
        const sourceRoot = await createSourceRoot();
        const calls = [];
        const dependencies = createDependencies(sourceRoot, calls);
        dependencies.reactStatic.preparePublicationReport =
            preparePublicationReport;

        try {
            await assert.rejects(
                runApiUpload(
                    {
                        bucket: 'test-bucket',
                        dryrun: true,
                        docs: 'highcharts',
                        expectedHighchartsVersion: '13.1.1',
                        expectedReactVersion: '5.0.1',
                        reactArtifact: '/tmp/react-static',
                        reactReport: tmpdir()
                    },
                    dependencies
                ),
                /Publication report must be a regular file/u
            );
            assert.deepEqual(calls.map(call => call[0]), ['verify', 'stage']);
        } finally {
            await rm(sourceRoot, { recursive: true, force: true });
        }
    });

    it('rethrows upload failures and always destroys the S3 session', async () => {
        const sourceRoot = await createSourceRoot();
        const calls = [];
        const uploadError = new Error('upload failed');
        const dependencies = createDependencies(sourceRoot, calls);
        dependencies.uploadS3.uploadDirectory = async () => {
            calls.push(['upload']);
            throw uploadError;
        };

        try {
            await assert.rejects(
                runApiUpload(
                    {
                        bucket: 'test-bucket',
                        docs: 'highcharts',
                        dryrun: true
                    },
                    dependencies
                ),
                uploadError
            );

            assert.ok(calls.includes('destroy'));
        } finally {
            await rm(sourceRoot, { recursive: true, force: true });
        }
    });

    it('skips legacy uploads on React publication failure and destroys the S3 session', async () => {
        const sourceRoot = await createSourceRoot();
        const calls = [];
        const publishError = new Error('React publication failed');
        const dependencies = createDependencies(sourceRoot, calls);
        dependencies.reactStatic.publishArtifact = async () => {
            calls.push(['publish']);
            throw publishError;
        };

        try {
            await assert.rejects(
                runApiUpload(
                    {
                        bucket: 'test-bucket',
                        dryrun: true,
                        expectedHighchartsVersion: '13.1.1',
                        expectedReactVersion: '5.0.1',
                        reactArtifact: '/tmp/react-static'
                    },
                    dependencies
                ),
                publishError
            );

            assert.ok(calls.includes('destroy'));
            assert.ok(calls.some(call => (
                Array.isArray(call) && call[0] === 'publish'
            )));
            assert.equal(calls.some(call => (
                Array.isArray(call) &&
                ['file', 'upload', 'sync'].includes(call[0])
            )), false);
        } finally {
            await rm(sourceRoot, { recursive: true, force: true });
        }
    });
});
