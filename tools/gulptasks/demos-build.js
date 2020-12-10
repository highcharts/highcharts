/*
 * Copyright (C) Highsoft AS
 */

const { task, series } = require('gulp');
const yargs = require('yargs');

const { handle: demoBuilder } = require('highcharts-demo-manager/lib/cli/cmd.build-demo-pages');
const { handle: thumbnailgenerator } = require('highcharts-demo-manager/lib/cli/cmd.genthumbnails');
const { handle: deployer } = require('highcharts-demo-manager/lib/cli/cmd.demo-deploy');
const { shouldUpdate } = require('./lib/git');

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
 * @return {Promise<void>}
 * Promise
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
 * @return {Promise<void>}
 * Promise
 */
async function cleanDemosHTML() {
    log(`Deleting ${TMP_PATH}`);
    deleteDirectory(TMP_PATH, true);
}

/**
 * Deletes the `tmp/demo-thumbnails` folder
 *
 * @return {Promise<void>}
 * Promise
 */
async function cleanDemoThumbnails() {
    const thumbnailPath = 'tmp/demo-thumbnails';
    log(`Deleting ${thumbnailPath}`);
    deleteDirectory(thumbnailPath, true);
}

/**
 * Generates thumbnails
 *
 * Optional arguments `--output <output path>`
 *
 * @param {Array<string>} [tags]
 * Optional tags to limit the build to
 * @return {Promise<void>}
 * Promise
 */
async function generateThumbnails(tags = void 0) {
    if (argv.tags) {
        tags = argv.tags.split(',');
    }
    if (!tags) {
        tags = [
            'Highcharts demo',
            'Highcharts Maps demo',
            'Highcharts Stock demo',
            'Highcharts Gantt demo'
        ];
    }

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
 *
 * @param {boolean} force
 * True or false
 *
 * @return {Promise<void>}
 * Promise
 */
async function deployDemos(force = false) {
    const { all, profile, dryrun } = argv;
    const AWSProfile = profile || 'default';

    // Deploy everything
    if (all || force) {
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
/**
 * Deploys demos in `tmp/demos-html`
 *
 * Usage `npx gulp demos-deploy --all`
 * Additional flags: `--dryrun`, `--profile <AWS profile>`
 *
 * @param {boolean} force
 * True or false
 *
 * @return {Promise<void>}
 * Promise
 */
async function deployThumbnails() {
    const { profile, dryrun } = argv;
    const AWSProfile = profile || 'default';

    // Deploy everything
    message(`Uploading all demos to ${S3_BUCKET} `);

    const args = {
        input: 'tmp/demo-thumbnails',
        output: 'demos/demo/images',
        bucket: S3_BUCKET,
        AWSProfile,
        dryrun
    };

    await deployer(args);
    success('Finished uploading thumbnails');

}


/**
 * Builds thumbnails for the product with at least one changed demo
 *
 * @param {boolean} [deploy]
 * Whether or not to deploy the changes
 * @return {Promise<void>}
 * Promise
 */
async function updateThumbnails(deploy = false) {
    await cleanDemoThumbnails();

    const tags = [];
    ['Highcharts', 'Gantt', 'Maps', 'Stock'].forEach(product => {
        if (shouldUpdate(`samples/${product.toLowerCase()}/demo`)) {
            if (product === 'Highcharts') {
                tags.push('Highcharts demo');
            } else {
                tags.push(`Highcharts ${product} demo`);
            }
        }
    });

    await generateThumbnails(tags);

    if (deploy) {
        await deployThumbnails();
    }

}

/**
 * Deploy demos if there has been a change in a demo folder in the latest commit
 * @return {Promise<void>}
 * Promise
 */
async function deployOnChanges() {
    if (shouldUpdate('samples/**/demo')) {
        message('Changes found, starting build...');
        await cleanDemosHTML();
        await buildAllDemos();
        message('Deploying...');
        await deployDemos(true);
        await updateThumbnails(true);
    }
    message('No changes in demo folders');
}

// Scripts for human users
task('demos-clean', cleanDemosHTML);
task('demos-build', series(cleanDemosHTML, buildAllDemos));
task('demos-thumbnails', generateThumbnails);
task('demos-deploy', deployDemos);
task('demos-build-and-deploy', series('demos-build', 'demos-deploy'));

// Scripts for robots
task('demos-deploy-if-changed', deployOnChanges);
task('demos-update-thumbnails', updateThumbnails);
