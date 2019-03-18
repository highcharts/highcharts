/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

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

    const ProcessLib = require('./lib/process');

    return new Promise((resolve, reject) => {

        ProcessLib
            .exec('rm -rf build/dist')
            .then(() => resolve())
            .catch(reject);
    });
}

Gulp.task('dist-clean', distClean);
