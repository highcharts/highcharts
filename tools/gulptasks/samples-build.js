/*
 * Copyright (C) Highsoft AS
 */

const { task, series } = require('gulp');
const yargs = require('yargs');
const { join } = require('path');

const argv = yargs(process.argv).argv;
const { deleteDirectory } = require('./lib/fs');
const { success, message } = require('./lib/log');
const { log } = console;
const { uploadFiles } = require('./lib/uploadS3');
const { handle: builder } = require('highcharts-demo-manager/lib/cli/cmd.builder');
const { handle: deployer } = require('highcharts-demo-manager/lib/cli/cmd.demo-deploy');
const { getFilesChanged } = require('./lib/git');

const SAMPLES_PATH = 'samples',
    TMP_PATH = 'tmp/samples-html',
    S3_BUCKET = 'assets.highcharts.com';

/**
 * Builds all the samples and places them in `tmp/samples-html`
 *
 * @return {Promise<void>}
 * Promise
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
 * @return {Promise<void>}
 * Promise
 */
async function deploySamples(paths = void 0) {
    const { all, profile, dryrun } = argv;
    if (!paths.length && argv.paths.length) {
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
        if (!subpath.includes('.html') && !subpath.endsWith('/')) {
            subpath = subpath + '/';
        }

        // Upload each version
        return Promise.all(['', 'embed', 'nonav'].map(thing => {
            const inputPath = join(TMP_PATH, 'samples', thing, subpath),
                outputPath = join('demos/samples', thing, subpath);

            return deployer({
                input: inputPath,
                bucket: S3_BUCKET,
                AWSProfile,
                output: outputPath,
                'make-redirects': true,
                dryrun
            });
        }));

    });

    await Promise.all(uploadPromises);
    success('Done uploading samples!');
}
/**
 * Builds all samples, but only deploys samples where there have been changes in the last commit
 * @return {Promise<void>}
 * promise
 */
async function updateSamples() {
    const allChanges = await getFilesChanged();
    const shouldBeUpdated = allChanges.match(/.*samples\/.*?(?=demo\.)/gm);

    if (!shouldBeUpdated) {
        message('No changes found in `/samples`');
        return;
    }
    // If a demo file was added or removed we should _probably_ update the index file
    const shouldUpdateIndexPage = shouldBeUpdated.some(logString => logString.match(/^[AD]/));

    // Get just the subpaths and remove duplicates
    const filtered = shouldBeUpdated.flatMap(path => path.replace(/.*samples\//, ''))
        .filter((item, pos, arr) => arr.indexOf(item) === pos);
    await buildAllSamples();
    await deploySamples(filtered);

    if (shouldUpdateIndexPage && !argv.dryrun) {
        await uploadFiles({
            name: 'Samples index page',
            bucket: S3_BUCKET,
            files: [{
                from: join(TMP_PATH, '/samples/index.html'),
                to: 'demos/samples'
            }]
        });
    }

}

task('samples-build', series(cleanSampleHTML, buildAllSamples));
task('samples-deploy', deploySamples);
task('samples-clean', cleanSampleHTML);
task('samples-build-and-deploy', series('samples-build', 'samples-deploy'));
task('samples-update', updateSamples);
