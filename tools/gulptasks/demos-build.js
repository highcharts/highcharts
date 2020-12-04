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
    TMP_PATH = 'tmp/demos-html',
    S3_BUCKET = 'assets.highcharts.com';

/**
 * Builds all the demos and places them in `tmp/demos-html`
 *
 * @return {void}
 */
async function buildAllDemos() {
    const { stdout, stderr } = await exec(`${BASE_CMD} build-demo-pages -input ${SAMPLES_PATH} -output ${TMP_PATH}`);
    log(stdout);
    log(stderr);
}

/**
 * Deletes the `tmp/demos-html` folder
 *
 * @return {void}
 */
async function cleanDemosHTML() {
    log(`Deleting ${TMP_PATH}`);
    deleteDirectory(TMP_PATH, true);
}

/**
 * Deploys demos in `tmp/demos-html`
 *
 * Usage `npx gulp demos-deploy --paths gantt,highcharts...` or `npx gulp demos-deploy --all`
 * Additional flags: `--verbose --profile <AWS profile>`
 * @return {void}
 */
async function deployDemos() {
    const { all, verbose, profile, dryrun } = argv;

    const AWSProfile = profile || 'default';

    // Deploy everything
    if (all) {
        message(`Uploading all demos to ${S3_BUCKET} `);
        const { stdout, stderr } = await exec(`${BASE_CMD} demo-deploy -input ${TMP_PATH} ` +
            `-bucket ${S3_BUCKET} -AWSProfile ${AWSProfile} -output demos -make-redirects ${dryrun ? '-dryrun' : ''}`,
        { maxBuffer: 1024 * (1024 * 4) });

        if (verbose) {
            log(stdout);
        }
        if (stderr) {
            log(stderr);
        }

        success('Done uploading demos!');
        return;
    }

    throw new Error('Specify subfolders with --paths <subfolders> or upload everything with --all');
}

task('demos-build', series(cleanDemosHTML, buildAllDemos));
task('demos-deploy', deployDemos);
task('demos-clean', cleanDemosHTML);
task('demos-build-and-deploy', series('demos-build', 'demos-deploy'));
