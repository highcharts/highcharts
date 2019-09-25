/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const path = require('path');

/* *
 *
 *  Constants
 *
 * */

const CODE_DIRECTORY = 'code';

const CONFIGURATION_FILE = path.join('node_modules', '_gulptasks_scripts.json');

const CSS_DIRECTORY = 'css';

const GFX_DIRECTORY = 'gfx';

const JS_DIRECTORY = 'js';

const TS_DIRECTORY = 'ts';

/* *
 *
 *  Functions
 *
 * */

/**
 * @return {void}
 */
function saveRun() {

    const fs = require('fs');
    const fslib = require('./lib/fs');
    const stringlib = require('./lib/string');

    const latestCodeHash = fslib.getDirectoryHash(
        CODE_DIRECTORY, true, stringlib.removeComments
    );
    const latestCSSHash = fslib.getDirectoryHash(
        CSS_DIRECTORY, true, stringlib.removeComments
    );
    const latestGFXHash = fslib.getDirectoryHash(GFX_DIRECTORY);
    const latestJSHash = fslib.getDirectoryHash(
        JS_DIRECTORY, true, stringlib.removeComments
    );
    const latestTSHash = fslib.getDirectoryHash(TS_DIRECTORY, true);

    const configuration = {
        latestCodeHash,
        latestCSSHash,
        latestGFXHash,
        latestJSHash,
        latestTSHash
    };

    fs.writeFileSync(CONFIGURATION_FILE, JSON.stringify(configuration));
}

/**
 * Tests whether code and js directory are in sync.
 *
 * @return {boolean}
 *         True, if code is out of sync.
 */
function shouldRun() {

    const fs = require('fs');
    const fslib = require('./lib/fs');
    const log = require('./lib/log');
    const stringlib = require('./lib/string');

    let configuration = {
        latestCodeHash: '',
        latestCSSHash: '',
        latestGFXHash: '',
        latestJSHash: '',
        latestTSHash: ''
    };

    if (fs.existsSync(CONFIGURATION_FILE)) {
        configuration = JSON.parse(
            fs.readFileSync(CONFIGURATION_FILE).toString()
        );
    }

    const latestCodeHash = fslib.getDirectoryHash(
        CODE_DIRECTORY, true, stringlib.removeComments
    );
    const latestCSSHash = fslib.getDirectoryHash(
        CSS_DIRECTORY, true, stringlib.removeComments
    );
    const latestGFXHash = fslib.getDirectoryHash(GFX_DIRECTORY);
    const latestJSHash = fslib.getDirectoryHash(
        JS_DIRECTORY, true, stringlib.removeComments
    );
    const latestTSHash = fslib.getDirectoryHash(TS_DIRECTORY, true);

    if (latestCodeHash === configuration.latestCodeHash &&
        latestCSSHash === configuration.latestCSSHash &&
        latestGFXHash === configuration.latestGFXHash &&
        latestJSHash === configuration.latestJSHash &&
        latestTSHash === configuration.latestTSHash
    ) {

        log.success(
            '✓ Source code has not been modified' +
            ' since the last successful run.'
        );

        return false;
    }

    return true;
}

/* *
 *
 *  Tasks
 *
 * */

/**
 * @return {Promise<void>}
 *         Promise to keep
 */
function task() {

    const argv = require('yargs').argv;
    const logLib = require('./lib/log');
    const processLib = require('./lib/process');

    if (processLib.isRunning('scripts-watch')) {
        logLib.warn('Running watch process detected. Skipping task...');
        if (argv.force) {
            processLib.isRunning('scripts-watch', false, true);
        } else {
            return Promise.resolve();
        }
    }

    return new Promise((resolve, reject) => {

        if (shouldRun() ||
            argv.force ||
            processLib.isRunning('scripts_incomplete')
        ) {

            processLib.isRunning('scripts_incomplete', true, true);

            gulp.series('scripts-ts', 'scripts-css', 'scripts-js')(
                err => {

                    processLib.isRunning('scripts_incomplete', false, true);

                    saveRun();

                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        } else {

            logLib.message(
                'Hint: Run the `scripts-watch` task to watch the js ' +
                'and ts directories.'
            );

            resolve();
        }
    });
}

gulp.task('scripts', task);
