/*
 * Copyright (C) Highsoft AS
 */

const { task, series } = require('gulp');
const yargs = require('yargs');

const { handle: demoBuilder } = require('highcharts-demo-manager/lib/cli/cmd.build-demo-pages');
const { handle: thumbnailgenerator } = require('highcharts-demo-manager/lib/cli/cmd.genthumbnails');
const { handle: deployer } = require('highcharts-demo-manager/lib/cli/cmd.demo-deploy');


const argv = yargs(process.argv).argv;
const { deleteDirectory } = require('./lib/fs');
const { success, message } = require('./lib/log');
const { log } = console;

const SAMPLES_PATH = 'samples',
    TMP_PATH = 'tmp/demos-html',
    S3_BUCKET = 'assets.highcharts.com';

/**
 * Builds all the demos and places them in `tmp/demos-html`
 *
 * @return {void}
 */
async function buildAllDemos() {
    const args = {
        input: SAMPLES_PATH,
        output: TMP_PATH
    };

    await demoBuilder(args);
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
 * Generates thumbnails
 *
 * Optional arguments `--output <output path>`
 *
 * @return {void}
 */
async function generateThumbnails() {
    const tags = [
        'Highcharts demo',
        'Highcharts Maps demo',
        'Highcharts Stock demo',
        'Highcharts Gantt demo'
    ];

    const themes = [
        'default',
        'dark-unica',
        'sand-signika',
        'grid-light'
    ];

    const output = argv.output || 'tmp/demo-thumbnails';

    // Build per tag
    await thumbnailgenerator({
        input: './' + SAMPLES_PATH,
        output,
        tags: tags.join(),
        themes: themes.join(),
        scale: 2
    });

}

/**
 * Deploys demos in `tmp/demos-html`
 *
 * Usage `npx gulp demos-deploy --all`
 * Additional flags: `--dryrun`, `--profile <AWS profile>`
 * @return {void}
 */
async function deployDemos() {
    const { all, profile, dryrun } = argv;

    const AWSProfile = profile || 'default';

    // Deploy everything
    if (all) {
        message(`Uploading all demos to ${S3_BUCKET} `);

        const args = {
            input: TMP_PATH,
            output: 'demos',
            bucket: S3_BUCKET,
            AWSProfile,
            'make-redirects': true,
            dryrun
        };

        await deployer(args);
        success('Finished uploading demos');
    }

}

task('demos-build', series(cleanDemosHTML, buildAllDemos));
task('demos-thumbnails', generateThumbnails);
task('demos-deploy', deployDemos);
task('demos-clean', cleanDemosHTML);
task('demos-build-and-deploy', series('demos-build', 'demos-deploy'));
