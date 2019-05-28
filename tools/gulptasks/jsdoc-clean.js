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

    return new Promise((resolve, reject) => {

        try {
            if (!fsLib.deleteDirectory('build/api', true)) {
                throw new Error('Directory could not be deleted: build/api');
            }
            resolve();
        } catch (catchedError) {
            reject(catchedError);
        }
    });
}

gulp.task('jsdoc-clean', jsdDocClean);
