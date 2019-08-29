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
    const logLib = require('./lib/log');

    return new Promise((resolve, reject) => {

        try {
            fsLib.deleteDirectory('build/dist', true);
            resolve();
        } catch (catchedError) {
            logLib.failure(catchedError);
            reject(catchedError);
        }
    });
}

gulp.task('dist-clean', distClean);
