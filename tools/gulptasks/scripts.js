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

const CODE_DIRECTORY = 'code';

const CONFIGURATION_FILE = Path.join('node_modules', '_gulptasks_scripts.json');

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

    const FS = require('fs');
    const FSLib = require('./lib/fs');
    const StringLib = require('./lib/string');

    const latestCodeHash = FSLib.getDirectoryHash(
        CODE_DIRECTORY, true, StringLib.removeComments
    );
    const latestCSSHash = FSLib.getDirectoryHash(
        CSS_DIRECTORY, true, StringLib.removeComments
    );
    const latestGFXHash = FSLib.getDirectoryHash(GFX_DIRECTORY);
    const latestJSHash = FSLib.getDirectoryHash(
        JS_DIRECTORY, true, StringLib.removeComments
    );
    const latestTSHash = FSLib.getDirectoryHash(TS_DIRECTORY, true);

    const configuration = {
        latestCodeHash,
        latestCSSHash,
        latestGFXHash,
        latestJSHash,
        latestTSHash
    };

    FS.writeFileSync(CONFIGURATION_FILE, JSON.stringify(configuration));
}

/**
 * Tests whether code and js directory are in sync.
 *
 * @return {boolean}
 *         True, if code is out of sync.
 */
function shouldRun() {

    const FS = require('fs');
    const FSLib = require('./lib/fs');
    const LogLib = require('./lib/log');
    const StringLib = require('./lib/string');

    let configuration = {
        latestCodeHash: '',
        latestCSSHash: '',
        latestGFXHash: '',
        latestJSHash: '',
        latestTSHash: ''
    };

    if (FS.existsSync(CONFIGURATION_FILE)) {
        configuration = JSON.parse(
            FS.readFileSync(CONFIGURATION_FILE).toString()
        );
    }

    const latestCodeHash = FSLib.getDirectoryHash(
        CODE_DIRECTORY, true, StringLib.removeComments
    );
    const latestCSSHash = FSLib.getDirectoryHash(
        CSS_DIRECTORY, true, StringLib.removeComments
    );
    const latestGFXHash = FSLib.getDirectoryHash(GFX_DIRECTORY);
    const latestJSHash = FSLib.getDirectoryHash(
        JS_DIRECTORY, true, StringLib.removeComments
    );
    const latestTSHash = FSLib.getDirectoryHash(TS_DIRECTORY, true);

    if (latestCodeHash === configuration.latestCodeHash &&
        latestCSSHash === configuration.latestCSSHash &&
        latestGFXHash === configuration.latestGFXHash &&
        latestJSHash === configuration.latestJSHash &&
        latestTSHash === configuration.latestTSHash
    ) {

        LogLib.success(
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
    const LogLib = require('./lib/log');
    const ProcessLib = require('./lib/process');

    if (ProcessLib.isRunning('scripts-watch')) {
        LogLib.warn('Running watch process detected. Skipping task...');
        if (argv.force) {
            ProcessLib.isRunning('scripts-watch', false, true);
        } else {
            return Promise.resolve();
        }
    }

    return new Promise(resolve => {

        if (shouldRun() ||
            argv.force ||
            ProcessLib.isRunning('scripts_incomplete')
        ) {

            ProcessLib.isRunning('scripts_incomplete', true, true);

            Gulp.series('scripts-ts', 'scripts-css', 'scripts-js')(
                () => {

                    ProcessLib.isRunning('scripts_incomplete', false, true);

                    saveRun();

                    resolve();
                }
            );
        } else {

            LogLib.message(
                'Hint: Run the `scripts-watch` task to watch the js directory.'
            );

            resolve();
        }
    });
}

Gulp.task('scripts', task);
