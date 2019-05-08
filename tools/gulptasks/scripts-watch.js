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
    const FsLib = require('./lib/fs');
    const LogLib = require('./lib/log');
    const ProcessLib = require('./lib/process');

    if (ProcessLib.isRunning('scripts-watch') && !argv.force) {
        LogLib.warn('Running watch process detected. Skipping task...');
        return Promise.resolve();
    }

    return new Promise(resolve => {

        require('./scripts-js.js');
        require('./scripts-ts.js');

        let jsHash,
            tsHash;

        Gulp
            .watch(WATCH_GLOBS, done => {

                const buildTasks = [];
                const newJsHash = FsLib.getDirectoryHash('js', true);
                const newTsHash = FsLib.getDirectoryHash('ts', true);

                if (newTsHash !== tsHash) {
                    tsHash = newTsHash;
                    buildTasks.push('scripts-ts');
                }

                if (newJsHash !== jsHash) {
                    jsHash = newJsHash;
                    buildTasks.push('scripts-js');
                }

                if (buildTasks.length === 0) {
                    LogLib.success('No significant changes found.');
                    done();
                    return;
                }

                Gulp.series(...buildTasks)(done);
            })
            .on('add', filePath => LogLib.warn('Modified', filePath))
            .on('change', filePath => LogLib.warn('Modified', filePath))
            .on('unlink', filePath => LogLib.warn('Modified', filePath))
            .on('error', LogLib.failure);

        LogLib.warn('Watching [', WATCH_GLOBS.join(', '), '] ...');

        ProcessLib.isRunning('scripts-watch', true);

        resolve();
    });
}

require('./scripts-js.js');
require('./scripts-ts.js');

Gulp.task('scripts-watch', Gulp.series('scripts-js', 'scripts-ts', task));
