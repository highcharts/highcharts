/*
 * Copyright (C) Highsoft AS
 */

const { task, series } = require('gulp');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const yargs = require('yargs');
const argv = yargs(process.argv).argv;
const { deleteDirectory } = require('./lib/fs');
const { success, message } = require('./lib/log');
const { log } = console;

const BASE_CMD = 'npx highcharts-demo-manager',
    SAMPLES_PATH = 'samples',
    TMP_PATH = 'tmp/samples-html',
    S3_BUCKET = 'assets.highcharts.com';

/**
 * Builds all the samples and places them in `tmp/samples-html`
 *
 * @return {void}
 */
async function buildAllSamples() {
    const { stdout } = await exec(`${BASE_CMD} build -input ${SAMPLES_PATH} -output ${TMP_PATH}`);
    log(stdout);
}

/**
 * Deletes the `tmp/samples-html` folder
 *
 * @return {void}
 */
async function cleanSampleHTML() {
    log(`Deleting ${TMP_PATH}`);
    deleteDirectory(TMP_PATH, true);
}

/**
 * Deploys samples in `tmp/samples-html`
 *
 * Usage `npx gulp samples-deploy --paths gantt,highcharts...` or `npx gulp samples-deploy --all`
 * Additional flags: `--verbose --profile <AWS profile>`
 * @return {void}
 */
async function deploySamples() {
    const { paths, all, verbose, profile } = argv;

    const AWSProfile = profile || 'default';

    if (!paths && !all) {
        throw new Error('Specify subfolders with --paths <subfolders> or upload everything with --all');
    }

    // Deploy everything
    if (all) {
        message(`Uploading all samples to ${S3_BUCKET} `);
        const { stdout, stderr } = await exec(`${BASE_CMD} demo-deploy -input ${TMP_PATH} ` +
            `-bucket ${S3_BUCKET} -AWSProfile ${AWSProfile} -output demos -make-redirects`,
        { maxBuffer: 1024 * (1024 * 4) });

        if (verbose) {
            log(stdout);
        }
        if (stderr) {
            log(stderr);
        }

        success('Done uploading samples!');
        return;
    }

    // Deploy specified paths
    if (!argv.paths.length) {
        throw new Error('You must specify one or more subfolders, i.e. --paths highcharts,gantt');
    }

    message(`Uploading samples to ${S3_BUCKET} `);
    const subpaths = argv.paths.split(',');
    const execPromises = subpaths.map(subpath => {
        if (!subpath.startsWith('/')) {
            subpath = '/' + subpath;
        }
        const inputPath = `${TMP_PATH}/samples${subpath}`,
            outputPath = `demos/samples${subpath}`;

        return exec(`${BASE_CMD} demo-deploy -input ${inputPath} ` +
            `-bucket ${S3_BUCKET} -AWSProfile ${AWSProfile} -output ${outputPath} -make-redirects`);
    });

    for await (const deploy of execPromises) {
        const { stdout, stderr } = deploy;
        if (verbose) {
            log(stdout);
        }
        if (stderr) {
            log(stderr);
        }
    }
    success('Done uploading samples!');
}

task('samples-build', series(cleanSampleHTML, buildAllSamples));
task('samples-deploy', deploySamples);
task('samples-clean', cleanSampleHTML);
task('samples-build-and-deploy', series('samples-build', 'samples-deploy'));
