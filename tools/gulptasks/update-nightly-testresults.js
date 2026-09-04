/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const childProcess = require('node:child_process');
const os = require('node:os');
const util = require('node:util');
const glob = require('glob');
const logLib = require('../libs/log');
const argv = require('yargs').argv;
const highchartsVersion = require('../../package').version;
const {
    downloadLatestNightlyArchive,
    submitNightlyVisualReview
} = require('./lib/visualReviewApi');

const TRANSPARENT_GIF = Buffer.from(
    'R0lGODlhAQABAPAAAP8AAAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',
    'base64'
);
const PROGRESS_BAR_WIDTH = 30;
const DEFAULT_REFERENCE_ROOT = 'tmp/nightly-reference-samples';
const unzip = util.promisify(childProcess.execFile);

function createUploadProgressBar(output = process.stderr) {
    const isTTY = output.isTTY === true;
    let rendered = false;

    function update({ completed, total }) {
        if (!isTTY || !total) {
            return;
        }

        const progress = Math.min(Math.max(completed / total, 0), 1);
        const completedWidth = Math.round(progress * PROGRESS_BAR_WIDTH);
        output.write(
            '\rUploading nightly visual artifacts [' +
            `${'#'.repeat(completedWidth)}${'-'.repeat(PROGRESS_BAR_WIDTH - completedWidth)}] ` +
            `${completed}/${total}`
        );
        rendered = true;
    }

    function finish() {
        if (isTTY && rendered) {
            output.write('\n');
        }
    }

    return { finish, update };
}

function readTestResultsFile(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function hasVisualTestErrors(errorPath = 'test/visual-test-errors.log') {
    try {
        return fs.statSync(errorPath).size > 0;
    } catch (error) {
        if (error.code === 'ENOENT') {
            return false;
        }
        throw error;
    }
}

function normalizeSampleName(file, sampleRoot) {
    return path
        .relative(sampleRoot, path.dirname(file))
        .split(path.sep)
        .join('/');
}

function assertSeparateRoots(sampleRoot, referenceRoot) {
    const resolvedSampleRoot = path.resolve(sampleRoot);
    const resolvedReferenceRoot = path.resolve(referenceRoot);
    const rootsOverlap =
        resolvedSampleRoot === resolvedReferenceRoot ||
        resolvedSampleRoot.startsWith(`${resolvedReferenceRoot}${path.sep}`) ||
        resolvedReferenceRoot.startsWith(`${resolvedSampleRoot}${path.sep}`);

    if (rootsOverlap) {
        throw new Error(
            'sampleRoot and referenceRoot must be separate, non-overlapping directories'
        );
    }
}

function copyReferenceFile(file, sampleRoot, referenceRoot) {
    const sampleName = normalizeSampleName(file, sampleRoot);
    const destination = path.join(
        referenceRoot,
        ...sampleName.split('/'),
        'reference.svg'
    );
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(file, destination);
}

function copyNightlyReferences({
    referenceRoot = DEFAULT_REFERENCE_ROOT,
    sampleRoot = 'samples'
} = {}) {
    assertSeparateRoots(sampleRoot, referenceRoot);
    const referenceFiles = glob
        .sync(path.join(sampleRoot, '**', 'reference.svg').replace(/\\/gu, '/'))
        .sort();

    fs.rmSync(referenceRoot, { recursive: true, force: true });
    for (const file of referenceFiles) {
        copyReferenceFile(file, sampleRoot, referenceRoot);
    }
    logLib.message(
        `Copied ${referenceFiles.length} nightly reference image(s) to ${referenceRoot}.`
    );
}

function getVisualReviewApiUrl() {
    return argv.visualReviewApiUrl || process.env.VISUAL_REVIEW_API_URL;
}

function getVisualReviewApiKey() {
    return argv.visualReviewApiKey || process.env.VISUAL_REVIEW_API_KEY;
}

async function syncNightlyReferences({
    apiKey = getVisualReviewApiKey(),
    apiUrl = getVisualReviewApiUrl(),
    dependencies,
    fetchImpl,
    referenceRoot = DEFAULT_REFERENCE_ROOT,
    sampleRoot = 'samples',
    unzipImpl = unzip
} = {}) {
    const referenceFiles = glob
        .sync(path.join(referenceRoot, '**', 'reference.svg').replace(/\\/gu, '/'))
        .sort();
    if (referenceFiles.length === 0) {
        logLib.message(
            'Synced 0 current reference image(s) from the Visual Review API; ' +
            '0 new reference image(s) kept.'
        );
        return;
    }

    const apiDependencies = { ...dependencies };
    if (fetchImpl) {
        apiDependencies.fetchImpl = fetchImpl;
    }
    const archive = await downloadLatestNightlyArchive({
        apiKey,
        apiUrl,
        dependencies: apiDependencies
    });
    if (archive === null) {
        logLib.message(
            'Synced 0 current reference image(s) from the Visual Review API; ' +
            `${referenceFiles.length} new reference image(s) kept.`
        );
        return;
    }

    const temporaryRoot = fs.mkdtempSync(path.join(
        os.tmpdir(),
        'highcharts-nightly-references-'
    ));
    let synced = 0;
    let missing = 0;
    try {
        const archivePath = path.join(temporaryRoot, 'artifacts.zip');
        const archiveRoot = path.join(temporaryRoot, 'artifacts');
        fs.writeFileSync(archivePath, archive);
        fs.mkdirSync(archiveRoot, { recursive: true });
        await unzipImpl('unzip', [
            '-q',
            '-o',
            archivePath,
            '-d',
            archiveRoot
        ]);

        for (const file of referenceFiles) {
            const sampleName = normalizeSampleName(file, referenceRoot);
            const archivedReference = path.join(
                archiveRoot,
                ...sampleName.split('/'),
                'reference.svg'
            );
            if (
                !fs.existsSync(archivedReference) ||
                !fs.lstatSync(archivedReference).isFile()
            ) {
                missing++;
                continue;
            }
            const destination = path.join(
                sampleRoot,
                ...sampleName.split('/'),
                'reference.svg'
            );
            fs.mkdirSync(path.dirname(destination), { recursive: true });
            fs.copyFileSync(archivedReference, destination);
            synced++;
        }
    } finally {
        fs.rmSync(temporaryRoot, { recursive: true, force: true });
    }

    logLib.message(
        `Synced ${synced} current reference image(s) from the Visual Review API; ` +
        `${missing} new reference image(s) kept.`
    );
}


function readReferenceArtifact(sampleName, referenceRoot, sampleRoot) {
    const root = referenceRoot || sampleRoot;
    return fs.readFileSync(
        path.join(root, ...sampleName.split('/'), 'reference.svg')
    );
}


function createNightlySubmissionSamples({
    referenceRoot,
    sampleRoot = 'samples',
    testResults = {}
} = {}) {
    const referenceSourceRoot = referenceRoot || sampleRoot;
    const referenceFiles = glob
        .sync(path.join(referenceSourceRoot, '**', 'reference.svg').replace(/\\/gu, '/'))
        .sort();

    return referenceFiles.map(file => {
        const sampleName = normalizeSampleName(file, referenceSourceRoot);
        const reference = readReferenceArtifact(
            sampleName,
            referenceRoot,
            sampleRoot
        );
        const comparisonValue = typeof testResults[sampleName] === 'number' &&
            testResults[sampleName] > 0 ?
            testResults[sampleName] :
            0;
        const samplePath = path.join(sampleRoot, ...sampleName.split('/'));
        const candidatePath = path.join(samplePath, 'candidate.svg');
        const differencePath = path.join(samplePath, 'diff.gif');

        if (comparisonValue > 0) {
            if (!fs.existsSync(candidatePath) || !fs.existsSync(differencePath)) {
                throw new Error(
                    `Missing comparison artifacts for ${sampleName}`
                );
            }
            return {
                name: sampleName,
                comparisonValue,
                artifacts: {
                    reference
                }
            };
        }

        return {
            name: sampleName,
            comparisonValue,
            artifacts: {
                reference,
                candidate: reference,
                difference: TRANSPARENT_GIF
            }
        };
    });
}


function getRunOptions() {
    const runId = process.env.GITHUB_RUN_ID || String(Date.now());
    return {
        runAttempt: process.env.GITHUB_RUN_ATTEMPT || '1',
        runId,
        runNumber: process.env.GITHUB_RUN_NUMBER || runId
    };
}

function createTestReport(testResults, productVersion) {
    const report = testResults || {};
    report.meta = {
        ...(report.meta || {}),
        version: report.meta?.version || productVersion
    };
    return report;
}

async function updateNightlyTestResults() {
    const {
        errorsPath = 'test/visual-test-errors.log',
        referenceRoot,
        resultsPath = 'test/visual-test-results.json',
        sampleRoot = 'samples'
    } = argv;
    const productVersion = argv.productVersion || argv.tag || highchartsVersion;

    if (argv.dryrun) {
        logLib.message('Dryrun (skipping nightly visual review API submission)..');
        return true;
    }
    if (hasVisualTestErrors(errorsPath)) {
        logLib.warn('Visual test errors found; skipping nightly visual review API finalization.');
        return false;
    }

    const testResults = readTestResultsFile(resultsPath);
    const samples = createNightlySubmissionSamples({
        referenceRoot,
        sampleRoot,
        testResults
    });

    if (samples.length === 0) {
        throw new Error('No reference SVG files found for nightly visual review submission');
    }

    const progressBar = createUploadProgressBar();
    let result;
    try {
        result = await submitNightlyVisualReview({
            ...getRunOptions(),
            apiKey: getVisualReviewApiKey(),
            apiUrl: getVisualReviewApiUrl(),
            productVersion,
            sampleRoot,
            samples,
            testReport: createTestReport(testResults, productVersion),
            onProgress: progressBar.update
        });
    } finally {
        progressBar.finish();
    }
    logLib.message(`Nightly visual review submission ${result.submissionId} finalized.`);
    return true;
}

updateNightlyTestResults.description = 'Publishes nightly visual results through the Visual Review API.';
updateNightlyTestResults.flags = {
    '--dryrun': 'Skips the Visual Review API submission.',
    '--errors-path': 'Path to the visual test errors log.',
    '--reference-root': 'Root folder containing preserved current reference images.',
    '--product-version': 'Product version label for the nightly submission.',
    '--results-path': 'Path to the visual test results JSON file.',
    '--sample-root': 'Root folder containing sample reference images.',
    '--tag': 'Product version label. Kept for parity with dist-testresults.',
    '--visual-review-api-url': 'Use VISUAL_REVIEW_API_URL to select the service origin. Defaults to https://vrevs.highsoft.com.',
    '--visual-review-api-key': 'Use VISUAL_REVIEW_API_KEY to authenticate with the Visual Review API.'
};

gulp.task('update-nightly-testresults', updateNightlyTestResults);
gulp.task('copy-nightly-references', async () => {
    copyNightlyReferences({
        referenceRoot: argv.referenceRoot || DEFAULT_REFERENCE_ROOT,
        sampleRoot: argv.sampleRoot || 'samples'
    });
});
gulp.task('sync-nightly-references', () => syncNightlyReferences({
    apiKey: getVisualReviewApiKey(),
    apiUrl: getVisualReviewApiUrl(),
    referenceRoot: argv.referenceRoot || DEFAULT_REFERENCE_ROOT,
    sampleRoot: argv.sampleRoot || 'samples'
}));


module.exports = {
    assertSeparateRoots,
    copyNightlyReferences,
    createNightlySubmissionSamples,
    createTestReport,
    default: updateNightlyTestResults,
    hasVisualTestErrors,
    readTestResultsFile,
    syncNightlyReferences,
    TRANSPARENT_GIF
};
