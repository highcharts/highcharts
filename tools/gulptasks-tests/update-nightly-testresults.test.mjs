import assert from 'node:assert/strict';
import {
    access,
    mkdtemp,
    mkdir,
    readFile,
    rm,
    writeFile
} from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const require = createRequire(import.meta.url);
const commandArgv = { _: [], $0: 'node' };
Object.defineProperty(require('yargs'), 'argv', {
    value: commandArgv
});

const nightlyTestResults = await import('../gulptasks/update-nightly-testresults.js');
const {
    assertSeparateRoots,
    copyNightlyReferences,
    createNightlySubmissionSamples,
    hasVisualTestErrors,
    readTestResultsFile,
    syncNightlyReferences,
    TRANSPARENT_GIF
} = nightlyTestResults;
const updateNightlyTestResults = nightlyTestResults.default.default;

function response(status = 200, body = '') {
    const bytes = Buffer.isBuffer(body) ? body : Buffer.from(String(body));
    return {
        ok: status >= 200 && status < 300,
        status,
        headers: { get: () => null },
        async arrayBuffer() {
            return bytes.buffer.slice(
                bytes.byteOffset,
                bytes.byteOffset + bytes.byteLength
            );
        },
        async json() {
            return JSON.parse(bytes.toString());
        },
        async text() {
            return bytes.toString();
        }
    };
}

async function writeSample(root, sampleName, files) {
    const samplePath = join(root, ...sampleName.split('/'));
    await mkdir(samplePath, { recursive: true });
    await Promise.all(Object.entries(files).map(([name, contents]) =>
        writeFile(join(samplePath, name), contents)
    ));
}

test('creates nightly API samples from generated reference files', async () => {
    const sampleRoot = await mkdtemp(join(tmpdir(), 'highcharts-nightly-samples-'));
    try {
        await writeSample(sampleRoot, 'highcharts/demo/changed', {
            'reference.svg': '<svg>old</svg>',
            'candidate.svg': '<svg>new</svg>',
            'diff.gif': 'GIF89a'
        });
        await writeSample(sampleRoot, 'highcharts/demo/unchanged', {
            'reference.svg': '<svg>same</svg>'
        });

        assert.deepEqual(
            createNightlySubmissionSamples({
                sampleRoot,
                testResults: {
                    'highcharts/demo/changed': 12,
                    'highcharts/demo/unchanged': 0
                }
            }),
            [
                {
                    name: 'highcharts/demo/changed',
                    comparisonValue: 12,
                    artifacts: {
                        reference: Buffer.from('<svg>old</svg>')
                    }
                },
                {
                    name: 'highcharts/demo/unchanged',
                    comparisonValue: 0,
                    artifacts: {
                        reference: Buffer.from('<svg>same</svg>'),
                        candidate: Buffer.from('<svg>same</svg>'),
                        difference: TRANSPARENT_GIF
                    }
                }
            ]
        );
    } finally {
        await rm(sampleRoot, { recursive: true, force: true });
    }
});

test('copies generated references to a clean reference root', async () => {
    const sampleRoot = await mkdtemp(join(tmpdir(), 'highcharts-nightly-copy-'));
    const referenceRoot = await mkdtemp(join(tmpdir(), 'highcharts-nightly-reference-'));
    try {
        await writeSample(sampleRoot, 'highcharts/demo/basic-line', {
            'reference.svg': '<svg>current</svg>'
        });
        await writeSample(referenceRoot, 'stale/sample', {
            'reference.svg': '<svg>stale</svg>'
        });

        copyNightlyReferences({ referenceRoot, sampleRoot });

        await assert.rejects(
            readFile(join(referenceRoot, 'stale', 'sample', 'reference.svg'))
        );
        assert.equal(
            await readFile(
                join(referenceRoot, 'highcharts', 'demo', 'basic-line', 'reference.svg'),
                'utf8'
            ),
            '<svg>current</svg>'
        );
    } finally {
        await rm(sampleRoot, { recursive: true, force: true });
        await rm(referenceRoot, { recursive: true, force: true });
    }
});

test('rejects overlapping sample and reference roots', () => {
    assert.throws(
        () => assertSeparateRoots('samples', 'samples'),
        /must be separate/u
    );
    assert.throws(
        () => assertSeparateRoots('samples', 'samples/references'),
        /must be separate/u
    );
    assert.throws(
        () => assertSeparateRoots('samples', '.'),
        /must be separate/u
    );
});

test('fails when results or error logs cannot be read safely', async () => {
    const root = await mkdtemp(join(tmpdir(), 'highcharts-nightly-errors-'));
    const malformedResults = join(root, 'malformed.json');
    try {
        await writeFile(malformedResults, '{');

        assert.throws(
            () => readTestResultsFile(join(root, 'missing.json')),
            error => error.code === 'ENOENT'
        );
        assert.throws(
            () => readTestResultsFile(malformedResults),
            SyntaxError
        );
        assert.throws(
            () => hasVisualTestErrors('\0'),
            error => error.code === 'ERR_INVALID_ARG_VALUE'
        );
    } finally {
        await rm(root, { recursive: true, force: true });
    }
});

test('syncs current references from the latest nightly archive', async () => {
    const sampleRoot = await mkdtemp(join(tmpdir(), 'highcharts-nightly-sync-'));
    const referenceRoot = await mkdtemp(join(tmpdir(), 'highcharts-nightly-reference-'));
    const requests = [];
    let archiveRoot;
    try {
        await writeSample(referenceRoot, 'highcharts/demo/basic-line', {
            'reference.svg': '<svg>new</svg>'
        });
        await writeSample(referenceRoot, 'highcharts/demo/new sample#1', {
            'reference.svg': '<svg>new-only</svg>'
        });
        await writeSample(sampleRoot, 'highcharts/demo/basic-line', {
            'reference.svg': '<svg>new</svg>'
        });
        await writeSample(sampleRoot, 'highcharts/demo/new sample#1', {
            'reference.svg': '<svg>new-only</svg>'
        });

        await syncNightlyReferences({
            apiKey: 'test-api-key',
            apiUrl: 'https://vrevs.test',
            dependencies: {
                minRequestInterval: 0,
                sleep: async () => {}
            },
            unzipImpl: async (command, args) => {
                assert.equal(command, 'unzip');
                assert.deepEqual(args.slice(0, 2), ['-q', '-o']);
                const archivePath = args[2];
                archiveRoot = args[4];
                assert.equal(args[3], '-d');
                assert.equal(await readFile(archivePath, 'utf8'), 'archive-bytes');
                await writeSample(archiveRoot, 'highcharts/demo/basic-line', {
                    'reference.svg': '<svg>current</svg>',
                    'candidate.svg': '<svg>candidate</svg>'
                });
                await writeSample(archiveRoot, 'retired/sample', {
                    'reference.svg': '<svg>retired</svg>'
                });
            },
            fetchImpl: async (url, options) => {
                requests.push({ options, url });
                return requests.length === 1 ?
                    response(200, JSON.stringify([{
                        version: '13.0.1',
                        runId: '9007199254740994',
                        runAttempt: '2',
                        runNumber: '1234',
                        finalizedTs: 0,
                        sampleCount: 2
                    }])) :
                    response(200, 'archive-bytes');
            },
            referenceRoot,
            sampleRoot
        });

        assert.deepEqual(requests.map(request => request.url), [
            'https://vrevs.test/api/reviews/nightly/latest',
            'https://vrevs.test/api/ingestion/nightly/submissions/' +
                '9007199254740994/attempts/2/artifacts.zip'
        ]);
        assert.deepEqual(requests.map(request => request.options.headers), [
            {
                accept: 'application/json'
            },
            {
                accept: 'application/zip',
                authorization: 'Bearer test-api-key'
            }
        ]);
        assert.equal(
            await readFile(
                join(sampleRoot, 'highcharts', 'demo', 'basic-line', 'reference.svg'),
                'utf8'
            ),
            '<svg>current</svg>'
        );
        assert.equal(
            await readFile(
                join(sampleRoot, 'highcharts', 'demo', 'new sample#1', 'reference.svg'),
                'utf8'
            ),
            '<svg>new-only</svg>'
        );
        await assert.rejects(
            access(join(sampleRoot, 'retired', 'sample', 'reference.svg')),
            error => error.code === 'ENOENT'
        );
        await assert.rejects(
            access(archiveRoot),
            error => error.code === 'ENOENT'
        );
    } finally {
        await rm(sampleRoot, { recursive: true, force: true });
        await rm(referenceRoot, { recursive: true, force: true });
    }
});

test('keeps generated references when no prior nightly archive exists', async () => {
    const sampleRoot = await mkdtemp(join(tmpdir(), 'highcharts-nightly-sync-'));
    const referenceRoot = await mkdtemp(join(tmpdir(), 'highcharts-nightly-reference-'));
    const requests = [];
    try {
        await writeSample(referenceRoot, 'highcharts/demo/new-sample', {
            'reference.svg': '<svg>new</svg>'
        });
        await writeSample(sampleRoot, 'highcharts/demo/new-sample', {
            'reference.svg': '<svg>new</svg>'
        });

        await syncNightlyReferences({
            apiKey: null,
            apiUrl: 'https://vrevs.test',
            dependencies: {
                fetchImpl: async (url, options) => {
                    requests.push({ options, url });
                    return response(200, '[]');
                }
            },
            unzipImpl: async () => {
                assert.fail('No archive should be extracted');
            },
            referenceRoot,
            sampleRoot
        });

        assert.deepEqual(requests, [{
            options: { headers: { accept: 'application/json' } },
            url: 'https://vrevs.test/api/reviews/nightly/latest'
        }]);
        assert.equal(
            await readFile(
                join(sampleRoot, 'highcharts', 'demo', 'new-sample', 'reference.svg'),
                'utf8'
            ),
            '<svg>new</svg>'
        );
    } finally {
        await rm(sampleRoot, { recursive: true, force: true });
        await rm(referenceRoot, { recursive: true, force: true });
    }
});

test('fails when the selected nightly archive is no longer current', async () => {
    const sampleRoot = await mkdtemp(join(tmpdir(), 'highcharts-nightly-sync-'));
    const referenceRoot = await mkdtemp(join(tmpdir(), 'highcharts-nightly-reference-'));
    let requests = 0;
    try {
        await writeSample(referenceRoot, 'highcharts/demo/basic-line', {
            'reference.svg': '<svg>new</svg>'
        });
        await writeSample(sampleRoot, 'highcharts/demo/basic-line', {
            'reference.svg': '<svg>new</svg>'
        });

        await assert.rejects(syncNightlyReferences({
            apiKey: 'test-api-key',
            apiUrl: 'https://vrevs.test',
            dependencies: {
                minRequestInterval: 0,
                sleep: async () => {}
            },
            unzipImpl: async () => {
                assert.fail('A missing archive should not be extracted');
            },
            fetchImpl: async () => ++requests === 1 ?
                response(200, JSON.stringify([{
                    runId: '9007199254740994',
                    runAttempt: '2'
                }])) :
                response(404, 'Nightly artifact archive not found'),
            referenceRoot,
            sampleRoot
        }), error => (
            error.name === 'VisualReviewApiError' &&
            error.status === 404
        ));
        assert.equal(requests, 2);
    } finally {
        await rm(sampleRoot, { recursive: true, force: true });
        await rm(referenceRoot, { recursive: true, force: true });
    }
});

test('submits nightly visual results with GitHub Actions metadata', async () => {
    const sampleRoot = await mkdtemp(join(tmpdir(), 'highcharts-nightly-submit-'));
    const resultsPath = join(sampleRoot, 'results.json');
    const errorsPath = join(sampleRoot, 'errors.log');
    const previousEnvironment = {
        GITHUB_RUN_ATTEMPT: process.env.GITHUB_RUN_ATTEMPT,
        GITHUB_RUN_ID: process.env.GITHUB_RUN_ID,
        GITHUB_RUN_NUMBER: process.env.GITHUB_RUN_NUMBER,
        VISUAL_REVIEW_API_KEY: process.env.VISUAL_REVIEW_API_KEY,
        VISUAL_REVIEW_API_URL: process.env.VISUAL_REVIEW_API_URL
    };
    const previousArgv = Object.fromEntries(
        Object.entries(commandArgv).map(([key, value]) => [
            key,
            key === '_' ? [...value] : value
        ])
    );
    const previousFetch = globalThis.fetch;
    const requests = [];

    try {
        await writeSample(sampleRoot, 'highcharts/demo/basic-line', {
            'reference.svg': '<svg>old</svg>',
            'candidate.svg': '<svg>new</svg>',
            'diff.gif': 'GIF89a'
        });
        await writeFile(resultsPath, JSON.stringify({
            meta: { browser: 'Firefox' },
            'highcharts/demo/basic-line': 12
        }));

        process.env.GITHUB_RUN_ATTEMPT = '2';
        process.env.GITHUB_RUN_ID = '9876';
        process.env.GITHUB_RUN_NUMBER = '1234';
        process.env.VISUAL_REVIEW_API_KEY = 'test-api-key';
        process.env.VISUAL_REVIEW_API_URL = 'https://vrevs.test';

        for (const key of Object.keys(commandArgv)) {
            delete commandArgv[key];
        }
        Object.assign(commandArgv, {
            _: [],
            errorsPath,
            resultsPath,
            sampleRoot,
            tag: '13.0.1'
        });

        globalThis.fetch = async (...args) => {
            requests.push(args);
            return response();
        };

        assert.equal(await updateNightlyTestResults(), true);
        assert.equal(requests.length, 3);
        assert.equal(
            requests[0][0],
            'https://vrevs.test/api/ingestion/submissions/9876/attempts/2'
        );
        const manifest = JSON.parse(requests[0][1].body);
        assert.deepEqual(manifest.subject, { kind: 'nightly' });
        assert.equal(manifest.workflow, 'Nightly visual tests');
        assert.equal(manifest.runNumber, '1234');
        assert.equal(manifest.productVersion, '13.0.1');
        assert.deepEqual(manifest.testReport, {
            meta: {
                browser: 'Firefox',
                version: '13.0.1'
            },
            'highcharts/demo/basic-line': 12
        });
        assert.deepEqual(manifest.sampleResults, [{
            name: 'highcharts/demo/basic-line',
            comparisonValue: 12,
            artifactRoles: ['reference', 'candidate', 'difference']
        }]);
        assert.deepEqual(
            JSON.parse(requests[1][1].body).artifacts.map(artifact => [
                artifact.role,
                artifact.data
            ]),
            [
                ['reference', Buffer.from('<svg>old</svg>').toString('base64')],
                ['candidate', Buffer.from('<svg>new</svg>').toString('base64')],
                ['difference', Buffer.from('GIF89a').toString('base64')]
            ]
        );
    } finally {
        await rm(sampleRoot, { recursive: true, force: true });
        if (previousFetch === undefined) {
            delete globalThis.fetch;
        } else {
            globalThis.fetch = previousFetch;
        }
        for (const key of Object.keys(commandArgv)) {
            delete commandArgv[key];
        }
        Object.assign(commandArgv, previousArgv);
        for (const [key, value] of Object.entries(previousEnvironment)) {
            if (value === undefined) {
                delete process.env[key];
            } else {
                process.env[key] = value;
            }
        }
    }
});
