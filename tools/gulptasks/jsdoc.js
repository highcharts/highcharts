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
 * Create Highcharts API and class references from JSDoc
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function jsDoc() {

    const logLib = require('./lib/log');

    return new Promise(resolve => {

        logLib.success('Created API documentation');

        if (!process.argv.includes('jsdoc-watch')) {
            logLib.message(
                'Hint: Run the `jsdoc-watch` task to start the JSDoc server.'
            );
        }

        resolve();
    });
}

require('./jsdoc-clean');
require('./jsdoc-classes');
require('./jsdoc-namespace');
require('./jsdoc-options');
require('./jsdoc-websearch');

gulp.task(
    'jsdoc',
    gulp.series(
        'jsdoc-clean',
        'jsdoc-classes',
        'jsdoc-namespace',
        'jsdoc-options',
        'jsdoc-websearch',
        jsDoc
    )
);
