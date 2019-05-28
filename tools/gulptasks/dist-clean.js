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
 * Removes the `build/dist` directory.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function distClean() {

    const fsLib = require('./lib/fs');

    return new Promise(done => {

        fsLib.deleteDirectory('build/dist', true);
        done();
    });
}

gulp.task('dist-clean', distClean);
