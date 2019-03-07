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
function task() {

    const ProcessLib = require('./lib/process');

    return ProcessLib
        .exec('rm -rf build/dist')
        .then(() => {});
}

Gulp.task('dist-clean', task);
