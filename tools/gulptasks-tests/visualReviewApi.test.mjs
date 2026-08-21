import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import {
    buildSubmissionManifest,
    submitPullRequestVisualReview
} from '../gulptasks/lib/visualReviewApi.js';

const sha = 'a'.repeat(40);

function response(status = 200, body = '', retryAfter) {
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

async function createSampleRoot() {
    const root = await mkdtemp(join(tmpdir(), 'highcharts-visual-review-'));
    const samplePath = join(root, 'highcharts', 'demo', 'line-basic');
    await mkdir(samplePath, { recursive: true });
    await writeFile(join(samplePath, 'reference.svg'), '<svg/>');
    await writeFile(join(samplePath, 'candidate.svg'), '<svg/>');
    await writeFile(join(samplePath, 'diff.gif'), 'GIF89a');
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

test('uploads manifest and all artifacts before finalizing', async () => {
    const sampleRoot = await createSampleRoot();
    const calls = [];
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
            testReport: { status: 'complete' }
        });

        assert.deepEqual(result, {
            submissionId: '456:2',
            state: 'current'
        });
        assert.equal(calls.length, 5);
        assert.equal(calls[0].url, 'https://vrevs.highdev.dev/api/ingestion/submissions/456/attempts/2');
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
        assert.match(calls[1].url, /artifacts\/reference\?sampleName=highcharts%2Fdemo%2Fline-basic/u);
        assert.match(calls[2].url, /artifacts\/candidate\?sampleName=highcharts%2Fdemo%2Fline-basic/u);
        assert.match(calls[3].url, /artifacts\/difference\?sampleName=highcharts%2Fdemo%2Fline-basic/u);
        assert.equal(calls[1].options.headers['content-type'], 'image/svg+xml');
        assert.equal(calls[2].options.headers['content-type'], 'image/svg+xml');
        assert.equal(calls[3].options.headers['content-type'], 'image/gif');
        assert.equal(calls[4].url, 'https://vrevs.highdev.dev/api/ingestion/submissions/456/attempts/2/finalize');
        assert.equal(calls[4].options.method, 'POST');
        assert.equal(calls[0].options.headers.authorization, 'Bearer test-api-key');
    } finally {
        await rm(sampleRoot, { recursive: true, force: true });
    }
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
    const sampleRoot = await createSampleRoot();
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
        assert.equal(attempts, 6);
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

test('honors the full Retry-After value', async () => {
    const sleeps = [];
    let attempts = 0;

    await submitPullRequestVisualReview({
        apiKey: 'test-api-key',
        dependencies: {
            fetchImpl: async () => {
                attempts++;
                return attempts === 1 ? response(429, '', '60') : response();
            },
            minRequestInterval: 0,
            sleep: async delay => sleeps.push(delay)
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

    assert.equal(attempts, 3);
    assert.equal(sleeps[0], 60000);
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
