/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const WATCH_GLOBS = [
    'js/**/*.js'
];

/* *
 *
 *  Tasks
 *
 * */

/**
 * Continuesly watching sources to restart the `tsdoc` task.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function jsDocWatch() {

    const log = require('./lib/log');

    return new Promise(resolve => {

        require('./jsdoc.js');
        require('./jsdoc-server');

        const watchProcess = gulp.watch(WATCH_GLOBS, gulp.task('jsdoc'));

        watchProcess.on(
            'change',
            filePath => log.warn('Modified', filePath)
        );

        log.warn('Watching', WATCH_GLOBS[0], '...');

        gulp.task('jsdoc-server')();

        resolve();
    });
}

require('./jsdoc.js');

gulp.task('jsdoc-watch', gulp.series('jsdoc', jsDocWatch));
