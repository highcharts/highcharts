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
 * Continuesly watching sources to restart the `tsdoc` task.
 *
 * @return {void}
 */
function task() {

    const Log = require('./lib/log');

    const SOURCE_DIRECTORY = './ts';

    require('./tsdoc.js');

    Gulp.task('tsdoc')();

    Log.warn('Watching', SOURCE_DIRECTORY, '...');

    Gulp.watch(
        [
            SOURCE_DIRECTORY + '/**/*'
        ],
        Gulp.task('tsdoc')
    );
}

Gulp.task('tsdoc-watch', task);
