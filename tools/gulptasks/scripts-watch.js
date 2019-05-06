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
    'js/!(adapters|builds)/**/*.js',
    'ts/**/*.json',
    'ts/!(adapters|builds)/**/*.ts'
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

    const argv = require('yargs').argv;
    const LogLib = require('./lib/log');
    const ProcessLib = require('./lib/process');

    if (ProcessLib.isRunning('scripts-watch') && !argv.force) {
        LogLib.warn('Running watch process detected. Skipping task...');
        return Promise.resolve();
    }

    return new Promise(resolve => {

        require('./scripts-js.js');

        Gulp
            .watch(WATCH_GLOBS)
            .on(
                'change',
                filePath => {
                    LogLib.warn('Modified', filePath);
                    return Gulp.series('scripts-js', 'scripts-ts')(() => {});
                }
            )
            .on('error', LogLib.failure);

        LogLib.warn('Watching [', WATCH_GLOBS.join(', '), '] ...');

        ProcessLib.isRunning('scripts-watch', true);

        resolve();
    });
}

require('./scripts-js.js');

Gulp.task('scripts-watch', Gulp.series('scripts-js', 'scripts-ts', task));
