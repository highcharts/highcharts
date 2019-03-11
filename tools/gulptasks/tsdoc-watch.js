/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const SOURCE_GLOBS = [
    'ts/**/*'
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

    return new Promise(resolve => {

        require('./tsdoc.js');

        const watchProcess = Gulp.watch(SOURCE_GLOBS, Gulp.task('tsdoc'));

        watchProcess.on(
            'change',
            filePath => LogLib.warn('Modified', filePath)
        );

        LogLib.warn('Watching', SOURCE_GLOBS[0] + '...');

        resolve();
    });
}

Gulp.task('tsdoc-watch', Gulp.series('tsdoc', task));
