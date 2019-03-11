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
 * Run remaining dist tasks in `build.xml`.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function task() {

    const ProcessLib = require('./lib/process');

    return new Promise((resolve, reject) => {

        ProcessLib
            .exec('npx ant dist')
            .then(resolve)
            .catch(reject);
    });
}

Gulp.task('dist-ant', task);
