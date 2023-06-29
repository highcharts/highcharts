/*
 * Copyright (C) Highsoft AS
 */


const gulp = require('gulp');


/* *
 *
 *  Tasks
 *
 * */

/**
 * Copies files from samples as examples.
 *
 * @return {Promise<void>}
 * Promise to keep.
 */
async function distExamples() {

    const logLib = require('../lib/log');

    logLib.failure('Not implemented');

}


gulp.task('dashboards/dist-examples', distExamples);
