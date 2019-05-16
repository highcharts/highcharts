/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

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

    const log = require('./lib/log');

    return new Promise(resolve => {

        require('./tsdoc.js');

        const watchProcess = gulp.watch(SOURCE_GLOBS, gulp.task('tsdoc'));

        watchProcess.on(
            'change',
            filePath => log.warn('Modified', filePath)
        );

        log.warn('Watching', SOURCE_GLOBS[0] + '...');

        resolve();
    });
}

gulp.task('tsdoc-watch', gulp.series('tsdoc', task));
