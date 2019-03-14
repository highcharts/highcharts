/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const WATCH_GLOBS = [
    'js/!(adapters|builds)/*.js'
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

    const LogLib = require('./lib/log');

    return new Promise(resolve => {

        require('./jsdoc.js');
        require('./jsdoc-server');

        const watchProcess = Gulp.watch(WATCH_GLOBS, Gulp.task('jsdoc'));

        watchProcess.on(
            'change',
            filePath => LogLib.warn('Modified', filePath)
        );

        LogLib.warn('Watching', WATCH_GLOBS[0], '...');

        Gulp.task('jsdoc-server')();

        resolve();
    });
}

require('./jsdoc.js');

Gulp.task('jsdoc-watch', Gulp.series('jsdoc', jsDocWatch));
