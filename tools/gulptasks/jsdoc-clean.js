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
    const logLib = require('./lib/log');

    return new Promise((resolve, reject) => {

        try {
            fsLib.deleteDirectory('build/api', true);
            resolve();
        } catch (catchedError) {
            logLib.failure(catchedError);
            reject(catchedError);
        }
    });
}

gulp.task('jsdoc-clean', jsdDocClean);
