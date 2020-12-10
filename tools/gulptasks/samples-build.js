/*
 * Copyright (C) Highsoft AS
 */

const { task, series } = require('gulp');
const yargs = require('yargs');
const argv = yargs(process.argv).argv;
const { deleteDirectory, getDirectoryPaths } = require('./lib/fs');
const { success, message } = require('./lib/log');
const { log } = console;

const { handle: builder } = require('highcharts-demo-manager/lib/cli/cmd.builder');
const { handle: deployer } = require('highcharts-demo-manager/lib/cli/cmd.demo-deploy');


const { shouldUpdate } = require('./lib/git');

const SAMPLES_PATH = 'samples',
    TMP_PATH = 'tmp/samples-html',
    S3_BUCKET = 'assets.highcharts.com';

/**
 * Builds all the samples and places them in `tmp/samples-html`
 *
 * @return {void}
 */
async function buildAllSamples() {
    await builder({
        input: SAMPLES_PATH,
        output: TMP_PATH
    });
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
 *
 * @param {string} [paths]
 * paths to deploy
 *
 * @return {void}
 */
async function deploySamples(paths = void 0) {
    const { all, profile, dryrun } = argv;
    if (!paths.length && argv.paths) {
        paths = argv.paths.split(',');
    }

    const AWSProfile = profile || 'default';

    if (!paths && !all) {
        throw new Error('Specify subfolders with --paths <subfolders> or upload everything with --all');
    }

    // Deploy everything
    if (all) {
        message(`Uploading samples to ${S3_BUCKET} `);
        await deployer({
            input: TMP_PATH,
            bucket: S3_BUCKET,
            AWSProfile,
            output: 'demos',
            'make-redirects': true,
            dryrun
        });
        success('Done uploading samples!');
        return;
    }

    // Deploy specified paths
    if (!paths.length) {
        throw new Error('You must specify one or more subfolders, i.e. --paths highcharts,gantt');
    }

    message(`Uploading samples to ${S3_BUCKET} `);
    const uploadPromises = paths.map(subpath => {
        if (!subpath.startsWith('/')) {
            subpath = '/' + subpath;
        }
        const inputPath = `${TMP_PATH}/samples${subpath}`,
            outputPath = `demos/samples${subpath}`;

        return deployer({
            input: inputPath,
            bucket: S3_BUCKET,
            AWSProfile,
            output: outputPath,
            'make-redirects': true,
            dryrun
        });
    });

    await Promise.all(uploadPromises);
    success('Done uploading samples!');
}
/**
 * Builds all samples, but only deploys samples where there have been changes in the last commit
 * @return {void}
 */
async function updateSamples() {
    const sampleDirs = getDirectoryPaths('samples', false);
    const shouldBeUpdated = sampleDirs.filter(sample => shouldUpdate(sample)).flatMap(dir =>
        // We need to go deeper
        getDirectoryPaths(dir, false)
            .filter(subDir => shouldUpdate(subDir)));

    await buildAllSamples();
    await deploySamples(shouldBeUpdated.flatMap(path => path.replace(/^samples\//, '')));

}

task('samples-build', series(cleanSampleHTML, buildAllSamples));
task('samples-deploy', deploySamples);
task('samples-clean', cleanSampleHTML);
task('samples-build-and-deploy', series('samples-build', 'samples-deploy'));

task('samples-update', updateSamples);
