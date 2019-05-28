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

    return new Promise((resolve, reject) => {

        try {
            if (!fsLib.deleteDirectory('build/dist', true)) {
                throw new Error('Directory could not be deleted: build/dist');
            }
            resolve();
        } catch (catchedError) {
            reject(catchedError);
        }
    });
}

gulp.task('dist-clean', distClean);
