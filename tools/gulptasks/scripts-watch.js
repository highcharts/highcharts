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
    'js/!(adapters|builds)/**/*.js'
];

/* *
 *
 *  Tasks
 *
 * */

/**
 * Continuesly watching sources to restart the `scripts-js` task.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function task() {

    const LogLib = require('./lib/log');

    return new Promise(resolve => {

        require('./scripts-js.js');

        Gulp
            .watch(WATCH_GLOBS)
            .on(
                'change',
                filePath => {
                    LogLib.warn('Modified', filePath);
                    return Gulp.task('scripts-js')(() => {});
                }
            )
            .on('error', LogLib.failure);

        LogLib.warn('Watching [', WATCH_GLOBS.join(', '), '] ...');

        resolve();
    });
}

require('./scripts-js.js');

Gulp.task('scripts-watch', Gulp.series('scripts-js', task));
