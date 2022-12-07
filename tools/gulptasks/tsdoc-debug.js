/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const DEBUG_TARGET = 'tree-debug.json';

/* *
 *
 *  Tasks
 *
 * */

/**
 * @return {Promise<undefined>}
 *         Promise to keep
 */
function task() {

    const generator = require(
        '@highcharts/highcharts-documentation-generators'
    ).TypeScript;
    const logLib = require('./lib/log');

    return Promise
        .resolve()
        .then(() => generator.Project.debug('ts', DEBUG_TARGET))
        .then(logLib.success)
        .catch(logLib.failure);
}

gulp.task('tsdoc-debug', task);
