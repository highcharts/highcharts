/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const glob = require('glob');
const { uploadFiles } = require('./lib/uploadS3');

const SAMPLES_SRC_DIR = 'samples/**';
const DESTINATION_DIR = 'visualtests';
const NIGHTLY_DIFF_DEST_DIR = `${DESTINATION_DIR}/diffs/nightly`;

/**
 * Upload baseline/reference images and
 * visual test results and assets to S3.
 *
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
function uploadVisualTestResults() {
    const argv = require('yargs').argv;
    const dateString = new Date().toISOString().slice(0, 10);
    const promises = [];
    const defaultParams = {
        profile: argv.profile,
        s3Params: {
            ACL: void 0
        }
    };

    if (argv.bucket) {
        defaultParams.bucket = argv.bucket;
    } else {
        return Promise.reject(new Error('Please specify argument --bucket to upload to.'));
    }

    if (argv.tag || argv.saveresetdate) {
        // upload of baseline a.k.a reference images
        const latestReferenceImages = glob.sync(`${SAMPLES_SRC_DIR}/reference.svg`).map(file => ({
            from: file,
            to: `${DESTINATION_DIR}/reference/latest/${[...file.split('/')].slice(1).join('/')}`
        }));

        if (!argv.saveresetdate) {
            // upload baseline reference images to folder named after tag
            const referenceImages = glob.sync(`${SAMPLES_SRC_DIR}/reference.svg`).map(file => ({
                from: file,
                to: `${DESTINATION_DIR}/reference/${argv.tag}/${[...file.split('/')].slice(1).join('/')}`
            }));
            const versionedReferences = Object.assign({}, defaultParams, { files: [...referenceImages], name: 'Reference SVGs' });
            promises.push(uploadFiles(versionedReferences));
        } else {
            const resetReferenceImages = glob.sync(`${SAMPLES_SRC_DIR}/reference.svg`).map(file => ({
                from: file,
                to: `${DESTINATION_DIR}/reference/resets/${dateString}/${[...file.split('/')].slice(1).join('/')}`
            }));

            const resetReferences = Object.assign({}, defaultParams, { files: [...resetReferenceImages], name: 'Reset reference SVGs' });
            promises.push(uploadFiles(resetReferences));
        }

        const latestReferences = Object.assign({}, defaultParams, { files: [...latestReferenceImages], name: 'Reference SVGs' });
        promises.push(uploadFiles(latestReferences));
    } else {
        // upload of nightly snapshots a.k.a candidates to latest/ folder + date folder
        const resultsJson = glob.sync('test/visual-test-results.json').map(file => ({
            from: file,
            to: `${NIGHTLY_DIFF_DEST_DIR}/latest/${[...file.split('/')].pop()}`
        }));

        const resultImageFilesLatest = glob.sync(`${SAMPLES_SRC_DIR}/*+(candidate.svg|diff.png)`).map(file => ({
            from: file,
            to: `${NIGHTLY_DIFF_DEST_DIR}/latest/${[...file.split('/')].slice(1).join('/')}`
        }));

        const resultsJsonVersionedDestination = glob.sync('test/visual-test-results.json').map(file => ({
            from: file,
            to: `${NIGHTLY_DIFF_DEST_DIR}/${dateString}/${[...file.split('/')].pop()}`
        }));

        const resultImageFiles = glob.sync(`${SAMPLES_SRC_DIR}/*+(candidate.svg|diff.png)`).map(file => ({
            from: file,
            to: `${NIGHTLY_DIFF_DEST_DIR}/${dateString}/${[...file.split('/')].slice(1).join('/')}`
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
    '--bucket': 'The S3 bucket to upload to.',
    '--saveresetdate': 'If present, it will also upload the references to a separate folder in order to identify when' +
        ' the references was reset.'
};

gulp.task('dist-testresults', uploadVisualTestResults);
