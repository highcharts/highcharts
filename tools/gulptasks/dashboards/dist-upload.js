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
 * Uploads distribution files.
 *
 * @return {Promise<void>}
 * Promise to keep.
 */
async function distUpload() {

    const logLib = require('../lib/log');

    logLib.failure('Not implemented');

}


gulp.task('dashboards/dist-upload', distUpload);
