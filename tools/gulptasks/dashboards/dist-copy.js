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
 * Copies files over to the dashboards-dist repository, which has to be placed
 * in the same parent folder as this repository.
 *
 * @return {Promise<void>}
 * Promise to keep.
 */
async function distCopy() {

    const logLib = require('../lib/log');

    logLib.failure('Not implemented');

}


gulp.task('dashboards/dist-copy', distCopy);
