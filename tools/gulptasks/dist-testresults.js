/*
 * Copyright (C) Highsoft AS
 */

/* eslint func-style: 0, no-console: 0, max-len: 0 */
const gulp = require('gulp');
const glob = require('glob');
const { uploadFiles } = require('./lib/uploadS3');

const DEMO_DIR = 'samples/**/demo';
const DESTINATION_DIR = 'test/visualtests';

/**
 * Upload visual test results and assets to S3.
 *
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
function distUploadVisualTestResults() {
    const logLib = require('./lib/log');
    const argv = require('yargs').argv;
    const dateString = new Date().toISOString().slice(0, 10);
    const promises = [];

    if (argv.help) {
        logLib.message(`
            HIGHCHARTS TEST RESULTS DISTIBUTOR
            
            Available arguments for 'gulp dist-testresults':
            
            --tag
                Will look for reference.svg files and upload them to a S3 path with the
                specified tag.
        `);
        return Promise.resolve();
    }

    if (argv.tag) {
        const referenceImages = glob.sync(`${DEMO_DIR}/**/reference.svg`).map(file => ({
            from: file,
            to: `${DESTINATION_DIR}/reference/${argv.tag}/${[...file.split('/')].slice(-2).join('/')}`
        }));

        const latestReferenceImages = glob.sync(`${DEMO_DIR}/**/reference.svg`).map(file => ({
            from: file,
            to: `${DESTINATION_DIR}/reference/latest/${[...file.split('/')].slice(-2).join('/')}`
        }));

        promises.push(uploadFiles({ files: referenceImages, name: 'Reference SVGs' }));
        promises.push(uploadFiles({ files: latestReferenceImages, name: 'Reference SVGs (latest path)' }));

    } else {
        const resultsJson = glob.sync('test/visual-test-results.json').map(file => ({
            from: file,
            to: `${DESTINATION_DIR}/diffs/latest/${[...file.split('/')].pop()}`
        }));

        const resultImageFilesLatest = glob.sync(`${DEMO_DIR}/**/*+(candidate.svg|diff.gif)`).map(file => ({
            from: file,
            to: `${DESTINATION_DIR}/diffs/latest/${[...file.split('/')].slice(-2).join('/')}`
        }));

        const resultsJsonVersionedDestination = glob.sync('test/visual-test-results.json').map(file => ({
            from: file,
            to: `${DESTINATION_DIR}/diffs/${dateString}/${[...file.split('/')].pop()}`
        }));

        const resultImageFiles = glob.sync(`${DEMO_DIR}/**/*+(candidate.svg|diff.gif)`).map(file => ({
            from: file,
            to: `${DESTINATION_DIR}/diffs/${dateString}/${[...file.split('/')].slice(-2).join('/')}`
        }));

        promises.push(uploadFiles({ files: resultsJson, name: 'visual-test-results.json' }));
        promises.push(uploadFiles({ files: resultsJsonVersionedDestination, name: 'visual-test-results.json (versioned path)' }));
        promises.push(uploadFiles({ files: resultImageFiles, name: 'Visual test comparision' }));
        promises.push(uploadFiles({ files: resultImageFilesLatest, name: 'Visual test comparision' }));
    }
    return Promise.all(promises);
}

gulp.task('dist-testresults', distUploadVisualTestResults);
