/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const SOURCE_DIRECTORY = './ts';

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

    require('./tsdoc.js');

    Gulp.task('tsdoc')();

    LogLib.warn('Watching', SOURCE_DIRECTORY, '...');

    Gulp.watch(
        [
            SOURCE_DIRECTORY + '/**/*'
        ],
        Gulp.task('tsdoc')
    );
}

Gulp.task('tsdoc-watch', task);
