/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

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
 * Create Highcharts API and class references from JSDoc
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function task() {

    if (serverRunning) {
        return;
    }

    require('./jsdoc-server');

    Gulp.task('jsdoc-server')();

    serverRunning = true;
}

Gulp.task(
    'jsdoc',
    Gulp.series(
        'jsdoc-clean', 'jsdoc-classes', 'jsdoc-namespace', 'jsdoc-options', task
    )
);
