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
    'css/*.scss',
    'js/**/*.js'
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
function defaultTask() {

    const LogLib = require('./lib/log');

    return new Promise(resolve => {

        require('./scripts-css.js');
        require('./scripts-js.js');

        const watchProcess = Gulp.watch(
            WATCH_GLOBS,
            Gulp.series('scripts-css', 'scripts-js')
        );

        watchProcess.on(
            'change',
            filePath => LogLib.warn('Modified', filePath)
        );

        LogLib.warn('Watching [', WATCH_GLOBS.join(', '), '] ...');

        resolve();
    });
}

require('./scripts-css.js');
require('./scripts-js.js');

Gulp.task('default', Gulp.series('scripts-css', 'scripts-js', defaultTask));
