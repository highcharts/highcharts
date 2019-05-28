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
 * Removes the `build/api` directory.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function jsdDocClean() {

    const fsLib = require('./lib/fs');

    return new Promise(done => {

        fsLib.deleteDirectory('build/api', true);
        done();
    });
}

gulp.task('jsdoc-clean', jsdDocClean);
