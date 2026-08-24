import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const require = createRequire(import.meta.url);
const commandArgv = { _: [], $0: 'node' };
Object.defineProperty(require('yargs'), 'argv', {
    value: commandArgv
});

function response(status = 200, body = '') {
    return {
        ok: status >= 200 && status < 300,
        status,
        headers: { get: () => null },
        async text() {
            return body;
        }
    };
}

const updatePrTestResults = await import('../gulptasks/update-pr-testresults.js');
const {
    createSubmissionSamples,
    hasVisualTestErrors,
    writeCommentFile
} = updatePrTestResults;
const commentOnPR = updatePrTestResults.default.default;

const commentPath = join(process.cwd(), 'tmp', 'pr-visual-test-comment.json');
const visualTestErrorsPath = join(process.cwd(), 'test', 'visual-test-errors.log');
const environmentKeys = [
    'GITHUB_RUN_ATTEMPT',
    'GITHUB_RUN_ID',
    'GITHUB_RUN_NUMBER',
    'GITHUB_SHA',
    'VISUAL_REVIEW_API_KEY',
    'VISUAL_REVIEW_API_URL',
    'VISUAL_REVIEW_PR_SHA'
];

async function runComment({
    environment = {},
    existingComment,
    failSilently = false,
    fetchImplementation = async () => response(),
    immediateTimers = false,
    changedFilesProvider = () => '',
    testResults,
    visualTestErrors = false
}) {
    const resultsDirectory = await mkdtemp(join(tmpdir(), 'highcharts-pr-results-'));
    const resultsPath = join(resultsDirectory, 'results.json');
    const previousEnvironment = Object.fromEntries(
        environmentKeys.map(key => [key, process.env[key]])
    );
    const previousArgv = Object.fromEntries(
        Object.entries(commandArgv).map(([key, value]) => [
            key,
            key === '_' ? [...value] : value
        ])
    );
    let previousComment;
    let previousVisualTestErrors;
    const previousFetch = globalThis.fetch;
    const previousSetTimeout = globalThis.setTimeout;
    const requests = [];
    try {
        try {
            previousComment = await readFile(commentPath);
        } catch {
            previousComment = undefined;
        }
        try {
            previousVisualTestErrors = await readFile(visualTestErrorsPath);
        } catch {
            previousVisualTestErrors = undefined;
        }

        await rm(commentPath, { force: true });
        await rm(visualTestErrorsPath, { force: true });
        if (existingComment !== undefined) {
            await writeFile(commentPath, existingComment);
        }
        await writeFile(resultsPath, JSON.stringify(testResults));
        if (visualTestErrors) {
            await writeFile(visualTestErrorsPath, 'browser disconnected\n');
        }

        const values = {
            GITHUB_RUN_ATTEMPT: '1',
            GITHUB_RUN_ID: undefined,
            GITHUB_RUN_NUMBER: undefined,
            GITHUB_SHA: undefined,
            VISUAL_REVIEW_API_KEY: 'test-api-key',
            VISUAL_REVIEW_API_URL: 'https://vrevs.test',
            VISUAL_REVIEW_PR_SHA: 'a'.repeat(40),
            ...environment
        };
        for (const key of environmentKeys) {
            if (values[key] === undefined) {
                delete process.env[key];
            } else {
                process.env[key] = values[key];
            }
        }

        for (const key of Object.keys(commandArgv)) {
            delete commandArgv[key];
        }
        Object.assign(commandArgv, {
            _: [],
            failSilently,
            pr: '25068',
            resultsPath
        });

        globalThis.fetch = async (...args) => {
            requests.push(args);
            return fetchImplementation(...args, requests.length);
        };
        if (immediateTimers) {
            globalThis.setTimeout = callback => {
                callback();
                return 0;
            };
        }
        let comment;
        let result;
        try {
            result = await commentOnPR({ changedFilesProvider });
        } catch (error) {
            try {
                error.commentAfterAttempt = await readFile(commentPath, 'utf8');
            } catch {
                error.commentAfterAttempt = undefined;
            }
            throw error;
        } finally {
            try {
                comment = await readFile(commentPath, 'utf8');
            } catch {
                comment = undefined;
            }
        }
        return { comment, requests, result };
    } finally {
        await rm(resultsDirectory, { recursive: true, force: true });
        await rm(commentPath, { force: true });
        if (previousComment !== undefined) {
            await writeFile(commentPath, previousComment);
        }
        await rm(visualTestErrorsPath, { force: true });
        if (previousVisualTestErrors !== undefined) {
            await writeFile(visualTestErrorsPath, previousVisualTestErrors);
        }
        if (previousFetch === undefined) {
            delete globalThis.fetch;
        } else {
            globalThis.fetch = previousFetch;
        }
        if (previousSetTimeout === undefined) {
            delete globalThis.setTimeout;
        } else {
            globalThis.setTimeout = previousSetTimeout;
        }

        for (const key of Object.keys(commandArgv)) {
            delete commandArgv[key];
        }
        Object.assign(commandArgv, previousArgv);
        for (const key of environmentKeys) {
            if (previousEnvironment[key] === undefined) {
                delete process.env[key];
            } else {
                process.env[key] = previousEnvironment[key];
            }
        }
    }
}

test('creates API samples from positive visual differences', () => {
    assert.deepEqual(
        createSubmissionSamples({
            'highcharts/demo/unchanged': 0,
            'highcharts/demo/changed': 12
        }),
        [{
            name: 'highcharts/demo/changed',
            comparisonValue: 12
        }]
    );
});

test('detects visual test errors without requiring the file to exist', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'highcharts-visual-results-'));
    const errorPath = join(directory, 'errors.log');
    try {
        assert.equal(hasVisualTestErrors(errorPath), false);
        await writeFile(errorPath, 'browser disconnected\n');
        assert.equal(hasVisualTestErrors(errorPath), true);
    } finally {
        await rm(directory, { recursive: true, force: true });
    }
});

test('writes the PR comment payload', async () => {
    try {
        await writeCommentFile('TITLE_TEXT\nBODY_TEXT');
        assert.deepEqual(JSON.parse(await readFile(commentPath, 'utf8')), {
            title: 'TITLE_TEXT',
            body: 'BODY_TEXT'
        });
    } finally {
        await rm(commentPath, { force: true });
    }
});

test('submits results and writes a PR comment with the CI run metadata', async () => {
    const { comment, requests } = await runComment({
        environment: {
            GITHUB_RUN_ID: '9876',
            GITHUB_RUN_NUMBER: '1234',
            VISUAL_REVIEW_PR_SHA: 'b'.repeat(40)
        },
        testResults: {
            status: 'complete'
        }
    });

    assert.equal(requests.length, 2);
    const manifestRequest = requests[0];
    const manifest = JSON.parse(manifestRequest[1].body);
    assert.deepEqual({
        runNumber: manifest.runNumber,
        prNumber: manifest.subject.prNumber,
        prSha: manifest.subject.sha,
        testReport: manifest.testReport,
        submissionUrl: manifestRequest[0]
    }, {
        runNumber: '1234',
        prNumber: 25068,
        prSha: 'b'.repeat(40),
        testReport: {
            status: 'complete'
        },
        submissionUrl: 'https://vrevs.test/api/ingestion/submissions/9876/attempts/1'
    });
    assert.deepEqual(manifest.sampleResults, []);
    const commentPayload = JSON.parse(comment);
    assert.equal(commentPayload.title, 'Visual test results - No difference found');
});

test('uses GITHUB_RUN_ID as the runNumber fallback when GITHUB_RUN_NUMBER is unset', async () => {
    const { requests } = await runComment({
        environment: {
            GITHUB_RUN_ID: '5678'
        },
        testResults: {}
    });

    const manifest = JSON.parse(requests[0][1].body);
    assert.equal(manifest.runNumber, '5678');
    assert.match(requests[0][0], /submissions\/\d+\/attempts\/1$/u);
});

test('skips the existing PR comment when visual execution errors occur', async () => {
    const existingComment = '{"title":"Existing","body":"KEEP"}';
    for (const failSilently of [false, true]) {
        const { comment, requests, result } = await runComment({
            existingComment,
            failSilently,
            testResults: {},
            visualTestErrors: true
        });

        assert.equal(result, false);
        assert.equal(comment, existingComment);
        assert.equal(requests.length, 0);
    }
});

const submissionFailures = [
    ['finalization', {
        fetchImplementation: (_, __, callNumber) =>
            callNumber === 1 ? response() : response(400, 'finalization failed'),
        expectedRequests: 2,
        message: /returned 400/u
    }],
    ['authentication', {
        environment: {
            VISUAL_REVIEW_API_KEY: undefined
        },
        expectedRequests: 0,
        message: /Missing VISUAL_REVIEW_API_KEY/u
    }],
    ['network', {
        fetchImplementation: async () => {
            throw new Error('network failed');
        },
        expectedRequests: 3,
        immediateTimers: true,
        message: /Visual review request failed: network failed/u
    }]
];

test('returns non-success and preserves the comment for submission failures', async () => {
    const existingComment = '{"title":"Existing","body":"KEEP"}';
    for (const [failureType, failure] of submissionFailures) {
        await assert.rejects(
            runComment({
                existingComment,
                ...failure,
                testResults: {}
            }),
            error => failure.message.test(error.message) &&
                error.commentAfterAttempt === existingComment,
            failureType
        );
    }
});

test('fails silently without writing the comment for submission failures', async () => {
    const existingComment = '{"title":"Existing","body":"KEEP"}';
    for (const [failureType, failure] of submissionFailures) {
        const { comment, requests, result } = await runComment({
            existingComment,
            failSilently: true,
            ...failure,
            testResults: {}
        });

        assert.equal(result, false, failureType);
        assert.equal(comment, existingComment, failureType);
        assert.equal(requests.length, failure.expectedRequests, failureType);
    }
});
