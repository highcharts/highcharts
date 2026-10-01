/*
 * Copyright (C) Highsoft AS
 */

const FS = require('node:fs');
const Path = require('node:path');
const fs = require('../libs/fs');
const gulp = require('gulp');
const glob = require('glob');
const log = require('../libs/log');
const processLib = require('../libs/process');
const yargs = require('yargs');
const { getVisualSampleSkipReason } = require('../../test/visual-test-samples');

const SAMPLES_SRC_DIR = 'samples/**';
const VISUAL_SAMPLES_GLOB =
    'samples/{highcharts,stock,maps,gantt}/*/*/demo.{js,ts}';
const VISUAL_SAMPLE_MANIFEST_PATH = Path.resolve(
    'tmp/reset-visual-references.json'
);
let visualSampleIds = [];

/**
 * Resolve sample paths and globs to eligible Playwright visual sample IDs.
 * @param {string} tests
 *        Comma separated paths or globs relative to samples.
 * @param {string} [root]
 *        Repository root.
 * @return {Array<string>}
 *         Selected visual sample IDs.
 */
function getVisualSampleIds(tests, root = process.cwd()) {
    const rootPath = Path.resolve(root);
    const sampleRoot = Path.join(rootPath, 'samples');
    const patterns = tests.split(',')
        .map(pattern => pattern.trim()
            .replace(/\\/gu, '/')
            .replace(/^\.\//u, '')
            .replace(/^samples\//u, ''))
        .filter(Boolean);

    function getSampleId(file) {
        return Path.relative(
            sampleRoot,
            Path.dirname(Path.resolve(rootPath, file))
        ).replace(/\\/gu, '/');
    }

    const availableSamples = new Set(
        glob.sync(VISUAL_SAMPLES_GLOB, { cwd: rootPath, nodir: true })
            .map(getSampleId)
    );
    const selectedSamples = new Set();

    for (const pattern of patterns) {
        if (
            Path.posix.isAbsolute(pattern) ||
            /^[a-z]:\//iu.test(pattern) ||
            pattern.split('/').includes('..')
        ) {
            throw new Error(`Invalid visual sample path: ${pattern}`);
        }

        const scriptPattern = /\/demo\.(?:js|ts)$/u.test(pattern) ?
            `samples/${pattern}` :
            `samples/${pattern}/demo.{js,ts}`;

        for (const file of glob.sync(scriptPattern, {
            cwd: rootPath,
            nodir: true
        })) {
            const sampleId = getSampleId(file);

            if (
                availableSamples.has(sampleId) &&
                !getVisualSampleSkipReason(rootPath, sampleId)
            ) {
                selectedSamples.add(sampleId);
            }
        }
    }

    if (!selectedSamples.size) {
        throw new Error(
            `No eligible visual samples matched --tests "${tests}".`
        );
    }

    return [...selectedSamples].sort();
}

/**
 * Sets the correct config before creating the references
 * and uploading them to S3. Deletes any existing reference.svgs.
 * @return {void} Task result.
 */
function configureVisualTestRun() {
    log.starting('Setting config for creating and uploading reference images..');

    const { tests } = yargs.argv;

    if (!tests) {
        const errMsg = 'Please provide --tests using a comma separated list of path(s) or' +
            ' glob style like highcharts/3d/*.';
        log.failure(errMsg);
        throw new Error(errMsg);
    }

    visualSampleIds = getVisualSampleIds(tests);
    yargs.parse([...process.argv, '--saveresetdate', 'true']);

    const existingReferenceImages = glob.sync(
        `${SAMPLES_SRC_DIR}/reference.svg`
    );
    log.message(
        'Deleting existing reference.svgs:\n' +
        existingReferenceImages.join('\n')
    );
    existingReferenceImages.forEach(fs.deleteFile);
    log.starting('Initiate creation of new references..');
}

/**
 * Generate selected reference images with Playwright.
 * @param {object} [options]
 *        Internal execution overrides for tests.
 * @return {Promise<void>} Task result.
 */
async function runVisualReferenceTests(options = {}) {
    const execute = options.execute || processLib.exec;
    const manifestPath = options.manifestPath ||
        VISUAL_SAMPLE_MANIFEST_PATH;
    const sampleIds = options.sampleIds || visualSampleIds;

    FS.mkdirSync(Path.dirname(manifestPath), { recursive: true });
    FS.writeFileSync(manifestPath, JSON.stringify(sampleIds), 'utf8');

    try {
        await execute('npm run test:pw:visual', {
            env: {
                ...process.env,
                VISUAL_TEST_REFERENCE: '1',
                VISUAL_TEST_PATH: '',
                VISUAL_TEST_MANIFEST: manifestPath
            }
        });
    } finally {
        FS.rmSync(manifestPath, { force: true });
    }
}

gulp.task('reset-visual-references',
    gulp.series(
        configureVisualTestRun,
        runVisualReferenceTests,
        'dist-testresults'
    ));

module.exports = { getVisualSampleIds, runVisualReferenceTests };
