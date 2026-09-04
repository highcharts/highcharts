/*
 * Copyright (C) Highsoft AS
 */

const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_API_URL = 'https://vrevs.highsoft.com';
const DEFAULT_REPOSITORY = 'highcharts/highcharts';
const DEFAULT_PULL_REQUEST_WORKFLOW = 'Visual tests';
const DEFAULT_NIGHTLY_WORKFLOW = 'Nightly visual tests';
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

function readArtifactSource(source, filePath) {
    if (Buffer.isBuffer(source)) {
        return source;
    }
    return fs.readFileSync(filePath);
}

function readSampleArtifacts(sample, sampleRoot) {
    const samplePath = safeSamplePath(sample.name, sampleRoot);
    const artifacts = {};

    for (const [role, definition] of Object.entries(ARTIFACTS)) {
        const source = sample.artifacts?.[role];
        const filename = typeof source === 'string' ? source : definition.filename;
        const filePath = path.resolve(samplePath, filename);
        if (!filePath.startsWith(`${samplePath}${path.sep}`)) {
            throw new VisualReviewApiError(`Invalid artifact path for ${sample.name}`);
        }
        try {
            artifacts[role] = readArtifactSource(source, filePath);
        } catch (error) {
            throw new VisualReviewApiError(
                `Missing ${role} artifact for ${sample.name}: ${error.message}`
            );
        }
    }

    return artifacts;
}

function buildArtifactUploads(samples) {
    const uploads = [];
    let artifacts = [];
    let batchBytes = 0;

    function flushBatch() {
        if (artifacts.length > 0) {
            uploads.push({ artifacts });
            artifacts = [];
            batchBytes = 0;
        }
    }

    for (const sample of samples) {
        for (const role of Object.keys(ARTIFACTS)) {
            const bytes = sample.artifacts[role];
            if (bytes.length > MAX_BATCH_BYTES) {
                flushBatch();
                uploads.push({
                    artifact: {
                        bytes,
                        role,
                        sampleName: sample.name
                    }
                });
                continue;
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

    return uploads;
}

function getSubjectKind(options) {
    return options.subjectKind || options.subject?.kind || 'pull_request';
}

function buildSubmissionSubject(options) {
    const kind = getSubjectKind(options);
    if (kind === 'nightly') {
        return { kind };
    }
    if (kind !== 'pull_request') {
        throw new VisualReviewApiError(
            'subjectKind must be pull_request or nightly'
        );
    }
    return {
        kind,
        prNumber: pullRequestNumber(options.prNumber),
        sha: pullRequestSha(options.prSha)
    };
}

function getWorkflow(options) {
    if (options.workflow) {
        return options.workflow;
    }
    return getSubjectKind(options) === 'nightly' ?
        DEFAULT_NIGHTLY_WORKFLOW :
        DEFAULT_PULL_REQUEST_WORKFLOW;
}

function buildSubmissionManifest(options) {
    const samples = options.samples || [];
    return {
        repository: options.repository || DEFAULT_REPOSITORY,
        workflow: getWorkflow(options),
        runNumber: positiveInteger(options.runNumber, 'runNumber'),
        productVersion: String(options.productVersion),
        subject: buildSubmissionSubject(options),
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

async function downloadLatestNightlyArchive(options = {}) {
    const baseUrl = normalizeApiUrl(options.apiUrl);
    const dependencies = options.dependencies || {};
    const requestState = { lastRequestAt: 0 };
    const response = await request(
        `${baseUrl}/api/reviews/nightly/latest`,
        {
            headers: {
                accept: 'application/json'
            }
        },
        dependencies,
        requestState
    );
    let submissions;
    try {
        submissions = await response.json();
    } catch (error) {
        throw new VisualReviewApiError(
            `Invalid latest nightly submissions response: ${error.message}`
        );
    }
    if (!Array.isArray(submissions)) {
        throw new VisualReviewApiError(
            'Invalid latest nightly submissions response: expected an array'
        );
    }
    if (submissions.length === 0) {
        return null;
    }

    const apiKey = options.apiKey || process.env.VISUAL_REVIEW_API_KEY;
    if (!apiKey) {
        throw new VisualReviewApiError(
            'Missing VISUAL_REVIEW_API_KEY for nightly reference download'
        );
    }
    const submission = submissions[0];
    const runId = positiveInteger(submission?.runId, 'nightly runId');
    const runAttempt = positiveInteger(
        submission?.runAttempt,
        'nightly runAttempt'
    );
    const archiveResponse = await request(
        `${baseUrl}/api/ingestion/nightly/submissions/${runId}/` +
        `attempts/${runAttempt}/artifacts.zip`,
        {
            headers: {
                accept: 'application/zip',
                authorization: `Bearer ${apiKey}`
            }
        },
        dependencies,
        requestState
    );

    return Buffer.from(await archiveResponse.arrayBuffer());
}

/**
 * Uploads and finalizes a visual review submission.
 *
 * @param {object} options Submission options.
 * @param {function} [options.onProgress] Called after each artifact upload.
 * @return {Promise<{submissionId: string, state: string}>} Submission result.
 */
async function submitVisualReview(options) {
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
    const artifactUploads = buildArtifactUploads(samples);

    await request(submissionUrl, {
        method: 'PUT',
        headers: {
            ...headers,
            'content-type': 'application/json'
        },
        body: JSON.stringify(manifest)
    }, dependencies, requestState);

    for (const upload of artifactUploads) {
        const artifact = upload.artifact;
        const artifacts = upload.artifacts || [artifact];
        const url = artifact ?
            `${submissionUrl}/artifacts/${artifact.role}` +
                `?sampleName=${encodeURIComponent(artifact.sampleName)}` :
            `${submissionUrl}/artifacts`;
        await request(url, {
            method: 'PUT',
            headers: {
                ...headers,
                'content-type': artifact ?
                    ARTIFACTS[artifact.role].contentType :
                    'application/json'
            },
            body: artifact ?
                artifact.bytes :
                JSON.stringify({ artifacts })
        }, dependencies, requestState);
        if (onProgress) {
            for (const uploadedArtifact of artifacts) {
                onProgress({
                    completed: ++uploadedArtifacts,
                    total: totalArtifacts,
                    sampleName: uploadedArtifact.sampleName,
                    role: uploadedArtifact.role
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
async function submitPullRequestVisualReview(options) {
    return submitVisualReview({
        ...options,
        subjectKind: 'pull_request'
    });
}

async function submitNightlyVisualReview(options) {
    return submitVisualReview({
        ...options,
        subjectKind: 'nightly'
    });
}

module.exports = {
    buildSubmissionManifest,
    downloadLatestNightlyArchive,
    normalizeApiUrl,
    submitNightlyVisualReview,
    submitPullRequestVisualReview,
    submitVisualReview
};
