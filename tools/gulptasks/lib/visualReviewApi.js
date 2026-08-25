/*
 * Copyright (C) Highsoft AS
 */

const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_API_URL = 'https://vrevs.highsoft.com';
const DEFAULT_REPOSITORY = 'highcharts/highcharts';
const DEFAULT_WORKFLOW = 'Visual tests';
const MAX_ATTEMPTS = 3;
const MIN_REQUEST_INTERVAL_MS = 350;
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);
const MAX_BATCH_ARTIFACTS = 100;
const MAX_BATCH_BYTES = 7 * 1024 * 1024;
const ARTIFACTS = {
    reference: {
        contentType: 'image/svg+xml',
        filename: 'reference.svg'
    },
    candidate: {
        contentType: 'image/svg+xml',
        filename: 'candidate.svg'
    },
    difference: {
        contentType: 'image/gif',
        filename: 'diff.gif'
    }
};

class VisualReviewApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'VisualReviewApiError';
        this.status = status;
    }
}

function normalizeApiUrl(value = process.env.VISUAL_REVIEW_API_URL || DEFAULT_API_URL) {
    return String(value).replace(/\/+$/u, '');
}

function positiveInteger(value, name) {
    if (!/^[1-9]\d*$/u.test(String(value))) {
        throw new VisualReviewApiError(`${name} must be a canonical positive integer`);
    }
    return String(value);
}

function pullRequestNumber(value) {
    const number = Number(value);
    if (!Number.isSafeInteger(number) || number <= 0) {
        throw new VisualReviewApiError('pr must be a positive safe integer');
    }
    return number;
}

function pullRequestSha(value) {
    if (!/^[0-9a-f]{40}$/u.test(String(value))) {
        throw new VisualReviewApiError(
            'PR SHA must be a lowercase 40-character SHA'
        );
    }
    return String(value);
}

function safeSamplePath(sampleName, root = 'samples') {
    const sampleRoot = path.resolve(root);
    const samplePath = path.resolve(sampleRoot, ...String(sampleName).split('/'));
    if (samplePath === sampleRoot || !samplePath.startsWith(`${sampleRoot}${path.sep}`)) {
        throw new VisualReviewApiError(`Invalid sample name: ${sampleName}`);
    }
    return samplePath;
}

function readSampleArtifacts(sample, sampleRoot) {
    const samplePath = safeSamplePath(sample.name, sampleRoot);
    const artifacts = {};

    for (const [role, definition] of Object.entries(ARTIFACTS)) {
        const filename = sample.artifacts?.[role] || definition.filename;
        const filePath = path.resolve(samplePath, filename);
        if (!filePath.startsWith(`${samplePath}${path.sep}`)) {
            throw new VisualReviewApiError(`Invalid artifact path for ${sample.name}`);
        }
        try {
            artifacts[role] = fs.readFileSync(filePath);
        } catch (error) {
            throw new VisualReviewApiError(
                `Missing ${role} artifact for ${sample.name}: ${error.message}`
            );
        }
    }

    return artifacts;
}

function buildArtifactBatches(samples) {
    const batches = [];
    let artifacts = [];
    let batchBytes = 0;

    function flushBatch() {
        if (artifacts.length > 0) {
            batches.push(artifacts);
            artifacts = [];
            batchBytes = 0;
        }
    }

    for (const sample of samples) {
        for (const role of Object.keys(ARTIFACTS)) {
            const bytes = sample.artifacts[role];
            if (bytes.length > MAX_BATCH_BYTES) {
                throw new VisualReviewApiError(
                    `${role} artifact for ${sample.name} exceeds the batch size limit`
                );
            }
            if (
                artifacts.length >= MAX_BATCH_ARTIFACTS ||
                (artifacts.length > 0 &&
                batchBytes + bytes.length > MAX_BATCH_BYTES)
            ) {
                flushBatch();
            }
            artifacts.push({
                sampleName: sample.name,
                role,
                data: bytes.toString('base64')
            });
            batchBytes += bytes.length;
        }
    }
    flushBatch();

    return batches;
}

function buildSubmissionManifest(options) {
    const samples = options.samples || [];
    return {
        repository: options.repository || DEFAULT_REPOSITORY,
        workflow: options.workflow || DEFAULT_WORKFLOW,
        runNumber: positiveInteger(options.runNumber, 'runNumber'),
        productVersion: String(options.productVersion),
        subject: {
            kind: 'pull_request',
            prNumber: pullRequestNumber(options.prNumber),
            sha: pullRequestSha(options.prSha)
        },
        testReport: options.testReport,
        sampleResults: samples.map(sample => ({
            name: sample.name,
            comparisonValue: sample.comparisonValue,
            artifactRoles: ['reference', 'candidate', 'difference']
        }))
    };
}

function retryDelay(response, attempt) {
    const retryAfter = response?.headers?.get?.('retry-after');
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds) && seconds >= 0) {
        return seconds * 1000;
    }
    const retryAt = Date.parse(retryAfter);
    if (Number.isFinite(retryAt)) {
        const delay = retryAt - Date.now();
        if (delay > 0) {
            return delay;
        }
    }
    return 2 ** attempt * 1000;
}

function defaultSleep(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

async function waitForRequestSlot(dependencies, requestState) {
    const sleep = dependencies.sleep || defaultSleep;
    const interval = dependencies.minRequestInterval ??
        MIN_REQUEST_INTERVAL_MS;
    const delay = requestState.lastRequestAt + interval - Date.now();
    if (delay > 0) {
        await sleep(delay);
    }
    requestState.lastRequestAt = Date.now();
}

async function responseMessage(response) {
    let body = '';
    try {
        body = await response.text();
    } catch {
        // Keep the status as the useful error when the response body is unreadable.
    }
    return body ? `: ${body.slice(0, 500)}` : '';
}

async function request(url, options, dependencies = {}, requestState = {
    lastRequestAt: 0
}) {
    const fetchImpl = dependencies.fetchImpl || fetch;
    const sleep = dependencies.sleep || defaultSleep;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        let response;
        try {
            await waitForRequestSlot(dependencies, requestState);
            response = await fetchImpl(url, options);
        } catch (error) {
            if (attempt === MAX_ATTEMPTS - 1) {
                throw new VisualReviewApiError(
                    `Visual review request failed: ${error.message}`
                );
            }
            await sleep(2 ** attempt * 1000);
            continue;
        }

        if (response.ok) {
            return response;
        }

        if (RETRYABLE_STATUS_CODES.has(response.status) && attempt < MAX_ATTEMPTS - 1) {
            await sleep(retryDelay(response, attempt));
            continue;
        }

        throw new VisualReviewApiError(
            `Visual review request returned ${response.status}${await responseMessage(response)}`,
            response.status
        );
    }

    throw new VisualReviewApiError('Visual review request exhausted its retry attempts');
}

/**
 * Uploads and finalizes a pull-request visual review submission.
 *
 * @param {object} options Submission options.
 * @param {function} [options.onProgress] Called after each artifact upload.
 * @return {Promise<{submissionId: string, state: string}>} Submission result.
 */
async function submitPullRequestVisualReview(options) {
    const apiKey = options.apiKey || process.env.VISUAL_REVIEW_API_KEY;
    if (!apiKey) {
        throw new VisualReviewApiError(
            'Missing VISUAL_REVIEW_API_KEY for visual review submission'
        );
    }

    const runId = positiveInteger(options.runId, 'runId');
    const runAttempt = positiveInteger(options.runAttempt, 'runAttempt');
    const manifest = buildSubmissionManifest(options);
    const samples = (options.samples || []).map(sample => ({
        ...sample,
        artifacts: readSampleArtifacts(sample, options.sampleRoot)
    }));
    const baseUrl = normalizeApiUrl(options.apiUrl);
    const submissionUrl = `${baseUrl}/api/ingestion/submissions/${runId}/attempts/${runAttempt}`;
    const headers = {
        accept: 'application/json',
        authorization: `Bearer ${apiKey}`
    };
    const dependencies = options.dependencies || {};
    const onProgress = typeof options.onProgress === 'function' ?
        options.onProgress :
        null;
    const totalArtifacts = onProgress ?
        samples.length * Object.keys(ARTIFACTS).length :
        0;
    let uploadedArtifacts = 0;
    const requestState = { lastRequestAt: 0 };
    const artifactBatches = buildArtifactBatches(samples);

    await request(submissionUrl, {
        method: 'PUT',
        headers: {
            ...headers,
            'content-type': 'application/json'
        },
        body: JSON.stringify(manifest)
    }, dependencies, requestState);

    for (const artifacts of artifactBatches) {
        await request(`${submissionUrl}/artifacts`, {
            method: 'PUT',
            headers: {
                ...headers,
                'content-type': 'application/json'
            },
            body: JSON.stringify({ artifacts })
        }, dependencies, requestState);
        if (onProgress) {
            for (const artifact of artifacts) {
                onProgress({
                    completed: ++uploadedArtifacts,
                    total: totalArtifacts,
                    sampleName: artifact.sampleName,
                    role: artifact.role
                });
            }
        }
    }
    await request(`${submissionUrl}/finalize`, {
        method: 'POST',
        headers,
        body: null
    }, dependencies, requestState);

    return {
        submissionId: `${runId}:${runAttempt}`,
        state: 'current'
    };
}

module.exports = {
    buildSubmissionManifest,
    normalizeApiUrl,
    submitPullRequestVisualReview
};
