/*
 * Copyright (C) Highsoft AS
 */

const fs = require('./lib/fs');
const gulp = require('gulp');
const glob = require('glob');
const log = require('./lib/log');
const yargs = require('yargs');

const SAMPLES_SRC_DIR = 'samples/**';

/**
 * Sets the correct config before creating the references
 * and uploading them to S3. Deletes any existing reference.svgs.
 * @return {Promise} task result.
 */
function configureVisualTestRun() {
    log.starting('Setting config for creating and uploading reference images..');

    return new Promise((resolve, reject) => {
        const { tests } = yargs.argv;

        if (!tests) {
            const errMsg = 'Please provide --tests using a comma separated list of path(s) or' +
                ' glob style like highcharts/3d/*.';
            log.failure(errMsg);
            reject(errMsg);
        }
        const forcedArgs = [
            '--reference', 'true',
            '--saveresetdate', 'true'
        ];

        yargs.parse([...process.argv, ...forcedArgs]);

        const existingReferenceImages = glob.sync(`${SAMPLES_SRC_DIR}/reference.svg`);
        log.message('Deleting existing reference.svgs:\n' + existingReferenceImages.join('\n'));
        existingReferenceImages.forEach(fs.deleteFile);
        log.starting('Initiate creation of new references..');
        resolve();
    });

}
// gulp.task('pre-visual-tests', resetVisualTestReferences());
gulp.task('reset-visual-references',
    gulp.series(
        configureVisualTestRun,
        'test',
        'dist-testresults'
    ));
