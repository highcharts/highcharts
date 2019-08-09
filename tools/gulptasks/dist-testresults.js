/*
 * Copyright (C) Highsoft AS
 */

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
function uploadVisualTestResults() {
    const argv = require('yargs').argv;
    const dateString = new Date().toISOString().slice(0, 10);
    const promises = [];
    const defaultParams = {};

    if (argv.bucket) {
        defaultParams.bucket = argv.bucket;
    } else {
        return Promise.reject(new Error('Please specify argument --bucket to upload to.'));
    }

    if (argv.tag) {
        const referenceImages = glob.sync(`${DEMO_DIR}/**/reference.svg`).map(file => ({
            from: file,
            to: `${DESTINATION_DIR}/reference/${argv.tag}/${[...file.split('/')].slice(1).join('/')}`
        }));

        const latestReferenceImages = glob.sync(`${DEMO_DIR}/**/reference.svg`).map(file => ({
            from: file,
            to: `${DESTINATION_DIR}/reference/latest/${[...file.split('/')].slice(1).join('/')}`
        }));

        const uploadConfig = Object.assign({}, defaultParams, { files: [...referenceImages, ...latestReferenceImages], name: 'Reference SVGs' });
        promises.push(uploadFiles(uploadConfig));

    } else {
        const resultsJson = glob.sync('test/visual-test-results.json').map(file => ({
            from: file,
            to: `${DESTINATION_DIR}/diffs/latest/${[...file.split('/')].pop()}`
        }));

        const resultImageFilesLatest = glob.sync(`${DEMO_DIR}/**/*+(candidate.svg|diff.gif)`).map(file => ({
            from: file,
            to: `${DESTINATION_DIR}/diffs/latest/${[...file.split('/')].slice(1).join('/')}`
        }));

        const resultsJsonVersionedDestination = glob.sync('test/visual-test-results.json').map(file => ({
            from: file,
            to: `${DESTINATION_DIR}/diffs/${dateString}/${[...file.split('/')].pop()}`
        }));

        const resultImageFiles = glob.sync(`${DEMO_DIR}/**/*+(candidate.svg|diff.gif)`).map(file => ({
            from: file,
            to: `${DESTINATION_DIR}/diffs/${dateString}/${[...file.split('/')].slice(1).join('/')}`
        }));

        const resultsUploadConfig = Object.assign({}, defaultParams, { files: [...resultsJson, ...resultsJsonVersionedDestination], name: 'visual-test-results.json' });
        const assetsUploadConfig = Object.assign({}, defaultParams, { files: [...resultImageFiles, ...resultImageFilesLatest], name: 'Visual test comparision assets' });
        promises.push(uploadFiles(resultsUploadConfig));
        promises.push(uploadFiles(assetsUploadConfig));
    }
    return Promise.all(promises);
}

uploadVisualTestResults.description = 'Uploads images/assets from visual test runs. E.g candidate.svg, diff.gif and visual-test-results.json';
uploadVisualTestResults.flags = {
    '--tag': 'Will look for reference.svg files and upload them to a S3 path with the specified tag.',
    '--bucket': 'The S3 bucket to upload to.'
};

gulp.task('dist-testresults', uploadVisualTestResults);
