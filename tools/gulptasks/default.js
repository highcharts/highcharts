/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');
const Path = require('path');

/* *
 *
 *  Constants
 *
 * */

const CSS_DIRECTORY = 'css';

const ES_MODULES_DIRECTORY = Path.join('code', 'es-modules');

const JS_DIRECTORY = 'js';

const WATCH_GLOBS = [
    'js/**/*.js',
    'css/*.scss',
    'code/es-modules/**/*.js'
];

/* *
 *
 *  Variables
 *
 * */

let building = false;

/* *
 *
 *  Functions
 *
 * */

/**
 * @param {string} filePath
 *        File path
 *
 * @param {Dictionary<Function>} mapOfWatchFn
 *        Build scripts
 *
 * @return {void}
 */
function onChange(filePath, mapOfWatchFn) {

    if (building) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {

        const posixPath = filePath.split(Path.sep).join(Path.posix.sep);

        if (filePath.startsWith(CSS_DIRECTORY)) {
            building = true;
            Gulp.series('scripts-css', 'scripts-js')(error => {
                building = false;
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
            return;
        }

        if (filePath.startsWith(JS_DIRECTORY)) {
            // Build es-modules
            mapOfWatchFn['js/**/*.js']({ path: posixPath, type: 'change' });
            resolve();
            return;
        }

        if (filePath.startsWith(ES_MODULES_DIRECTORY)) {
            // Build dist files in classic mode.
            mapOfWatchFn['code/es-modules/**/*.js'](
                { path: posixPath, type: 'change' }
            );
            resolve();
            return;
        }

        resolve();
    });
}

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

    const argv = process.argv;
    const Build = require('../build');
    const LogLib = require('./lib/log');

    const buildScripts = Build.getBuildScripts({
        debug: (argv.d || argv.debug || false),
        files: (
            (argv.file) ?
                argv.file.split(',') :
                null
        ),
        type: (argv.type || null)
    });

    return new Promise(resolve => {

        require('./scripts-css.js');
        require('./scripts-js.js');

        Gulp
            .watch(WATCH_GLOBS)
            .on(
                'change',
                filePath => {
                    LogLib.warn('Modified', filePath);
                    onChange(filePath, buildScripts.mapOfWatchFn);
                    LogLib.success('Created code');
                }
            )
            .on(
                'error',
                LogLib.failure
            );

        LogLib.warn('Watching [', WATCH_GLOBS.join(', '), '] ...');

        resolve();
    });
}

require('./scripts-css.js');
require('./scripts-js.js');

Gulp.task('default', Gulp.series('scripts-css', 'scripts-js', defaultTask));
