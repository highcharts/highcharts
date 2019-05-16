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
    const fs = require('./lib/fs');
    const log = require('./lib/log');
    const process = require('./lib/process');

    if (process.isRunning('scripts-watch')) {
        log.warn('Running watch process detected. Skipping task...');
        if (argv.force) {
            process.isRunning('scripts-watch', false, true);
        } else {
            return Promise.resolve();
        }
    }

    return new Promise(resolve => {

        require('./scripts-js.js');
        require('./scripts-ts.js');

        let jsHash,
            tsHash;

        gulp
            .watch(WATCH_GLOBS, done => {

                const buildTasks = [];
                const newJsHash = fs.getDirectoryHash('js', true);
                const newTsHash = fs.getDirectoryHash('ts', true);

                if (newTsHash !== tsHash) {
                    tsHash = newTsHash;
                    buildTasks.push('scripts-ts');
                }

                if (newJsHash !== jsHash) {
                    jsHash = newJsHash;
                    buildTasks.push('scripts-js');
                }

                if (buildTasks.length === 0) {
                    log.success('No significant changes found.');
                    done();
                    return;
                }

                gulp.series(...buildTasks)(done);
            })
            .on('add', filePath => log.warn('Modified', filePath))
            .on('change', filePath => log.warn('Modified', filePath))
            .on('unlink', filePath => log.warn('Modified', filePath))
            .on('error', log.failure);

        log.warn('Watching [', WATCH_GLOBS.join(', '), '] ...');

        process.isRunning('scripts-watch', true);

        resolve();
    });
}

require('./scripts-js.js');
require('./scripts-ts.js');

gulp.task(
    'scripts-watch',
    gulp.series('scripts-ts', 'scripts-css', 'scripts-js', task)
);
