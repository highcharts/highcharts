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
 * Removes the `build/api` directory.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function jsdDocClean() {

    const ProcessLib = require('./lib/process');

    return new Promise((resolve, reject) => {

        ProcessLib
            .exec('rm -rf build/api')
            .then(resolve)
            .catch(reject);
    });
}

Gulp.task('jsdoc-clean', jsdDocClean);
