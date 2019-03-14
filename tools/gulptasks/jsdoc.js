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
 * Create Highcharts API and class references from JSDoc
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function jsDoc() {

    const LogLib = require('./lib/log');

    return new Promise(resolve => {

        LogLib.success('Created API documentation');

        if (!process.argv.includes('jsdoc-watch')) {
            LogLib.message(
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

Gulp.task(
    'jsdoc',
    Gulp.series(
        'jsdoc-clean', 'jsdoc-classes', 'jsdoc-namespace', 'jsdoc-options', jsDoc
    )
);
