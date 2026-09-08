import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import {
    buildSubmissionManifest,
    submitNightlyVisualReview,
    submitPullRequestVisualReview
} from '../gulptasks/lib/visualReviewApi.js';

const sha = 'a'.repeat(40);

function response(status = 200, body = '', ...retryAfterValues) {
    const retryAfter = retryAfterValues[0];
    return {
        ok: status >= 200 && status < 300,
        status,
        headers: {
            get(name) {
                return name === 'retry-after' ? retryAfter : null;
            }
        },
        async text() {
            return body;
        }
    };
}

async function createSampleRoot(samplesToCreate) {
    const root = await mkdtemp(join(tmpdir(), 'highcharts-visual-review-'));
    await Promise.all(samplesToCreate.map(async sampleDefinition => {
        const samplePath = join(root, ...sampleDefinition.name.split('/'));
        const artifacts = sampleDefinition.artifacts || {};
        await mkdir(samplePath, { recursive: true });
        await writeFile(
            join(samplePath, artifacts.reference || 'reference.svg'),
            '<svg/>'
        );
        await writeFile(
            join(samplePath, artifacts.candidate || 'candidate.svg'),
            '<svg/>'
        );
        await writeFile(
            join(samplePath, artifacts.difference || 'diff.gif'),
            'GIF89a'
        );
    }));
    return root;
}

function sample() {
    return [{
        name: 'highcharts/demo/line-basic',
        comparisonValue: 42,
        artifacts: {
            reference: 'reference.svg',
            candidate: 'candidate.svg',
            difference: 'diff.gif'
        }
    }];
}

function createSamples(count) {
    return Array.from({ length: count }, (_, index) => ({
        name: `highcharts/demo/line-basic-${index}`,
        comparisonValue: index
    }));
}

async function submitWithRetryAfter(retryAfter) {
    const sleeps = [];
    let requests = 0;

    await submitPullRequestVisualReview({
        apiKey: 'test-api-key',
        dependencies: {
            fetchImpl: async () => {
                requests++;
                return requests === 1 ? response(429, '', retryAfter) : response();
            },
            sleep: async delay => sleeps.push(delay)
        },
        minRequestInterval: 0,
        prNumber: 123,
        prSha: sha,
        productVersion: '13.0.1',
        runAttempt: '1',
        runId: '456',
        runNumber: '789',
        samples: [],
        testReport: {}
    });

    return { requests, sleeps };
}

async function withCurrentTime(currentTime, callback) {
    const originalNow = Date.now;
    Date.now = () => currentTime;
    try {
        return await callback();
    } finally {
        Date.now = originalNow;
    }
}

test('builds the exact pull-request manifest', () => {
    assert.deepEqual(
        buildSubmissionManifest({
            prNumber: 123,
            prSha: sha,
            productVersion: '13.0.1',
            runNumber: '456',
            samples: sample(),
            testReport: { meta: { version: '13.0.1' } }
        }),
        {
            repository: 'highcharts/highcharts',
            workflow: 'Visual tests',
            runNumber: '456',
            productVersion: '13.0.1',
            subject: {
                kind: 'pull_request',
                prNumber: 123,
                sha
            },
            testReport: { meta: { version: '13.0.1' } },
            sampleResults: [{
                name: 'highcharts/demo/line-basic',
                comparisonValue: 42,
                artifactRoles: ['reference', 'candidate', 'difference']
            }]
        }
    );
});

test('builds the exact nightly manifest', () => {
    assert.deepEqual(
        buildSubmissionManifest({
            productVersion: '13.0.1',
            runNumber: '456',
            samples: sample(),
            subjectKind: 'nightly',
            testReport: { meta: { version: '13.0.1' } }
        }),
        {
            repository: 'highcharts/highcharts',
            workflow: 'Nightly visual tests',
            runNumber: '456',
            productVersion: '13.0.1',
            subject: { kind: 'nightly' },
            testReport: { meta: { version: '13.0.1' } },
            sampleResults: [{
                name: 'highcharts/demo/line-basic',
                comparisonValue: 42,
                artifactRoles: ['reference', 'candidate', 'difference']
            }]
        }
    );
});

test('uploads a nightly submission without pull-request fields', async () => {
    const root = await mkdtemp(join(tmpdir(), 'highcharts-nightly-review-'));
    const samplePath = join(root, 'highcharts', 'demo', 'line-basic');
    const calls = [];
    try {
        await mkdir(samplePath, { recursive: true });
        await writeFile(join(samplePath, 'reference.svg'), '<svg/>');

        await submitNightlyVisualReview({
            apiKey: 'test-api-key',
            dependencies: {
                fetchImpl: async (url, options) => {
                    calls.push({ url, options });
                    return response();
                },
                sleep: async () => {}
            },
            productVersion: '13.0.1',
            runAttempt: '1',
            runId: '456',
            runNumber: '789',
            sampleRoot: root,
            samples: [{
                name: 'highcharts/demo/line-basic',
                comparisonValue: 0,
                artifacts: {
                    candidate: 'reference.svg',
                    difference: Buffer.from('GIF89a')
                }
            }],
            testReport: {}
        });

        const manifest = JSON.parse(calls[0].options.body);
        assert.deepEqual(manifest.subject, { kind: 'nightly' });
        assert.equal(manifest.workflow, 'Nightly visual tests');
        const artifacts = JSON.parse(calls[1].options.body).artifacts;
        assert.deepEqual(
            artifacts.map(artifact => [artifact.role, artifact.data]),
            [
                ['reference', Buffer.from('<svg/>').toString('base64')],
                ['candidate', Buffer.from('<svg/>').toString('base64')],
                ['difference', Buffer.from('GIF89a').toString('base64')]
            ]
        );
    } finally {
        await rm(root, { recursive: true, force: true });
    }
});

test('uploads manifest and all artifacts before finalizing', async () => {
    const sampleRoot = await createSampleRoot(sample());
    const calls = [];
    const progress = [];
    try {
        const result = await submitPullRequestVisualReview({
            apiKey: 'test-api-key',
            apiUrl: 'https://vrevs.highdev.dev/',
            dependencies: {
                fetchImpl: async (url, options) => {
                    calls.push({ url, options });
                    return response(options.method === 'PUT' && calls.length === 1 ? 201 : 200);
                },
                sleep: async () => {}
            },
            prNumber: 123,
            prSha: sha,
            productVersion: '13.0.1',
            runAttempt: '2',
            runId: '456',
            runNumber: '789',
            sampleRoot,
            samples: sample(),
            onProgress: event => progress.push(event),
            testReport: { status: 'complete' }
        });

        assert.deepEqual(result, {
            submissionId: '456:2',
            state: 'current'
        });
        assert.equal(calls.length, 3);
        assert.equal(
            calls[0].url,
            'https://vrevs.highdev.dev/api/ingestion/submissions/456/attempts/2'
        );
        assert.deepEqual(JSON.parse(calls[0].options.body), {
            repository: 'highcharts/highcharts',
            workflow: 'Visual tests',
            runNumber: '789',
            productVersion: '13.0.1',
            subject: { kind: 'pull_request', prNumber: 123, sha },
            testReport: { status: 'complete' },
            sampleResults: [{
                name: 'highcharts/demo/line-basic',
                comparisonValue: 42,
                artifactRoles: ['reference', 'candidate', 'difference']
            }]
        });
        assert.equal(
            calls[1].url,
            'https://vrevs.highdev.dev/api/ingestion/submissions/456/attempts/2/artifacts'
        );
        assert.equal(calls[1].options.method, 'PUT');
        assert.equal(calls[1].options.headers['content-type'], 'application/json');
        assert.deepEqual(JSON.parse(calls[1].options.body), {
            artifacts: [
                {
                    sampleName: 'highcharts/demo/line-basic',
                    role: 'reference',
                    data: Buffer.from('<svg/>').toString('base64')
                },
                {
                    sampleName: 'highcharts/demo/line-basic',
                    role: 'candidate',
                    data: Buffer.from('<svg/>').toString('base64')
                },
                {
                    sampleName: 'highcharts/demo/line-basic',
                    role: 'difference',
                    data: Buffer.from('GIF89a').toString('base64')
                }
            ]
        });
        assert.equal(
            calls[2].url,
            'https://vrevs.highdev.dev/api/ingestion/submissions/456/attempts/2/finalize'
        );
        assert.equal(calls[2].options.method, 'POST');
        assert.equal(calls[0].options.headers.authorization, 'Bearer test-api-key');
        assert.deepEqual(progress, [
            {
                completed: 1,
                total: 3,
                sampleName: 'highcharts/demo/line-basic',
                role: 'reference'
            },
            {
                completed: 2,
                total: 3,
                sampleName: 'highcharts/demo/line-basic',
                role: 'candidate'
            },
            {
                completed: 3,
                total: 3,
                sampleName: 'highcharts/demo/line-basic',
                role: 'difference'
            }
        ]);
    } finally {
        await rm(sampleRoot, { recursive: true, force: true });
    }
});

test('splits artifact uploads into endpoint-sized batches', async () => {
    const samples = createSamples(34);
    const sampleRoot = await createSampleRoot(samples);
    const calls = [];
    const progress = [];
    try {
        await submitPullRequestVisualReview({
            apiKey: 'test-api-key',
            dependencies: {
                fetchImpl: async (url, options) => {
                    calls.push({ url, options });
                    return response(
                        options.method === 'PUT' && calls.length === 1 ? 201 : 200
                    );
                },
                sleep: async () => {}
            },
            prNumber: 123,
            prSha: sha,
            productVersion: '13.0.1',
            runAttempt: '1',
            runId: '456',
            runNumber: '789',
            sampleRoot,
            samples,
            onProgress: event => progress.push(event),
            testReport: {}
        });

        assert.equal(calls.length, 4);
        const batchCalls = calls.slice(1, -1);
        assert.deepEqual(
            batchCalls.map(call => JSON.parse(call.options.body).artifacts.length),
            [100, 2]
        );
        const batchUrl =
            'https://vrevs.highsoft.com/api/ingestion/submissions/456/attempts/1/artifacts';
        assert.ok(batchCalls.every(call => call.url === batchUrl &&
            call.options.headers['content-type'] === 'application/json'));
        const artifacts = batchCalls.flatMap(call =>
            JSON.parse(call.options.body).artifacts);
        assert.equal(artifacts.length, 102);
        assert.equal(artifacts[0].sampleName, samples[0].name);
        assert.equal(artifacts[101].sampleName, samples[33].name);
        assert.equal(artifacts[101].role, 'difference');
        assert.equal(progress.length, 102);
        assert.equal(progress[101].completed, 102);
    } finally {
        await rm(sampleRoot, { recursive: true, force: true });
    }
});

test('uploads artifacts larger than a batch through the binary endpoint', async () => {
    const largeReference = Buffer.alloc(7 * 1024 * 1024 + 1);
    largeReference.write('<svg>');
    const calls = [];
    const progress = [];

    await submitPullRequestVisualReview({
        apiKey: 'test-api-key',
        dependencies: {
            fetchImpl: async (url, options) => {
                calls.push({ url, options });
                return response();
            },
            sleep: async () => {}
        },
        prNumber: 123,
        prSha: sha,
        productVersion: '13.0.1',
        runAttempt: '1',
        runId: '456',
        runNumber: '789',
        samples: [{
            name: 'maps/series-geoheatmap/geoheatmap-equalearth',
            comparisonValue: 42,
            artifacts: {
                reference: largeReference,
                candidate: Buffer.from('<svg/>'),
                difference: Buffer.from('GIF89a')
            }
        }],
        onProgress: event => progress.push(event),
        testReport: {}
    });

    assert.equal(calls.length, 4);
    assert.equal(
        calls[1].url,
        'https://vrevs.highsoft.com/api/ingestion/submissions/456/attempts/1/' +
        'artifacts/reference?sampleName=maps%2Fseries-geoheatmap%2F' +
        'geoheatmap-equalearth'
    );
    assert.equal(calls[1].options.headers['content-type'], 'image/svg+xml');
    assert.strictEqual(calls[1].options.body, largeReference);
    assert.deepEqual(
        JSON.parse(calls[2].options.body).artifacts.map(artifact => artifact.role),
        ['candidate', 'difference']
    );
    assert.deepEqual(
        progress.map(({ completed, role }) => [completed, role]),
        [
            [1, 'reference'],
            [2, 'candidate'],
            [3, 'difference']
        ]
    );
});

test('finalizes empty submissions', async () => {
    const calls = [];
    await submitPullRequestVisualReview({
        apiKey: 'test-api-key',
        dependencies: {
            fetchImpl: async (url, options) => {
                calls.push({ url, options });
                return response();
            },
            sleep: async () => {}
        },
        prNumber: 123,
        prSha: sha,
        productVersion: '13.0.1',
        runAttempt: '1',
        runId: '456',
        runNumber: '789',
        samples: [],
        testReport: {}
    });

    assert.equal(calls.length, 2);
    assert.deepEqual(JSON.parse(calls[0].options.body).sampleResults, []);
});

test('retries transient responses and does not retry client errors', async () => {
    const sampleRoot = await createSampleRoot(sample());
    let attempts = 0;
    try {
        await submitPullRequestVisualReview({
            apiKey: 'test-api-key',
            dependencies: {
                fetchImpl: async () => {
                    attempts++;
                    return attempts === 1 ? response(503, 'temporarily unavailable') : response();
                },
                sleep: async () => {}
            },
            prNumber: 123,
            prSha: sha,
            productVersion: '13.0.1',
            runAttempt: '1',
            runId: '456',
            runNumber: '789',
            sampleRoot,
            samples: sample(),
            testReport: {}
        });
        assert.equal(attempts, 4);
    } finally {
        await rm(sampleRoot, { recursive: true, force: true });
    }

    await assert.rejects(
        submitPullRequestVisualReview({
            apiKey: 'test-api-key',
            dependencies: {
                fetchImpl: async () => response(400, 'invalid manifest'),
                sleep: async () => {}
            },
            prNumber: 123,
            prSha: sha,
            productVersion: '13.0.1',
            runAttempt: '1',
            runId: '456',
            runNumber: '789',
            samples: [],
            testReport: {}
        }),
        error => error.status === 400 && /invalid manifest/u.test(error.message)
    );
});

test('honors numeric Retry-After seconds', async () => {
    const { requests, sleeps } = await submitWithRetryAfter('60');

    assert.equal(requests, 3);
    assert.equal(sleeps[0], 60000);
});

test('uses the date-relative delay for future HTTP-date Retry-After', async () => {
    const currentTime = Date.parse('Wed, 21 Oct 2015 07:28:00 GMT');
    const retryAfter = new Date(currentTime + 5000).toUTCString();
    const { sleeps } = await withCurrentTime(
        currentTime,
        () => submitWithRetryAfter(retryAfter)
    );

    assert.equal(sleeps[0], 5000);
});

test('uses the fallback delay for past HTTP-date Retry-After', async () => {
    const currentTime = Date.parse('Wed, 21 Oct 2015 07:28:00 GMT');
    const retryAfter = new Date(currentTime - 5000).toUTCString();
    const { sleeps } = await withCurrentTime(
        currentTime,
        () => submitWithRetryAfter(retryAfter)
    );

    assert.equal(sleeps[0], 1000);
});

test('uses the fallback delay for invalid Retry-After', async () => {
    const { sleeps } = await submitWithRetryAfter('not-a-date');

    assert.equal(sleeps[0], 1000);
});

test('does not create a request when an artifact is missing', async () => {
    const sampleRoot = await mkdtemp(join(tmpdir(), 'highcharts-visual-review-'));
    let requestCount = 0;
    try {
        await assert.rejects(
            submitPullRequestVisualReview({
                apiKey: 'test-api-key',
                dependencies: {
                    fetchImpl: async () => {
                        requestCount++;
                        return response();
                    }
                },
                prNumber: 123,
                prSha: sha,
                productVersion: '13.0.1',
                runAttempt: '1',
                runId: '456',
                runNumber: '789',
                sampleRoot,
                samples: sample(),
                testReport: {}
            }),
            /Missing reference artifact/u
        );
        assert.equal(requestCount, 0);
    } finally {
        await rm(sampleRoot, { recursive: true, force: true });
    }
});
