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
 *  Variables
 *
 * */

let serverRunning = false;

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

    return new Promise(resolve => {

        if (!serverRunning) {

            require('./jsdoc.js');
            require('./jsdoc-server');

            Gulp.watch(WATCH_FILES, Gulp.task('jsdoc'));

            LogLib.warn('Watching js...');

            Gulp.task('jsdoc-server')();

            serverRunning = true;
        }

        resolve();
    });
}

require('./jsdoc.js');

Gulp.task('jsdoc-watch', Gulp.series('jsdoc', task));
