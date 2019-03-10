/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const WATCH_FILES = [
    'js/!(adapters|builds)/*.js',
    'node_modules/highcharts-documentation-generators/api-docs/include/*.*',
    'node_modules/highcharts-documentation-generators/api-docs/templates/*.handlebars'
];

/* *
 *
 *  Tasks
 *
 * */

/**
 * Continuesly watching sources to restart the `tsdoc` task.
 *
 * @return {void}
 */
function task() {

    const LogLib = require('./lib/log');

    require('./jsdoc.js');

    Gulp.task('jsdoc')();

    LogLib.warn('Watching `js/`...');

    Gulp.watch(WATCH_FILES, Gulp.task('jsdoc'));
}

Gulp.task('jsdoc-watch', task);
