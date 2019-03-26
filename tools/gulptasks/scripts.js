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

    const configuration = {
        latestCodeHash,
        latestCSSHash,
        latestGFXHash,
        latestJSHash
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
        latestJSHash: ''
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

    if (latestCodeHash === configuration.latestCodeHash &&
        latestCSSHash === configuration.latestCSSHash &&
        latestGFXHash === configuration.latestGFXHash &&
        latestJSHash === configuration.latestJSHash
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

    const LogLib = require('./lib/log');
    const Yargs = require('yargs');

    return new Promise(resolve => {

        const argv = Yargs.argv;

        if (shouldRun() ||
            argv.force ||
            process.env.HIGHCHARTS_GULPTASKS_SCRIPTS
        ) {

            process.env.HIGHCHARTS_GULPTASKS_SCRIPTS = true;

            Gulp.series('scripts-css', 'scripts-js')(
                () => {

                    delete process.env.HIGHCHARTS_GULPTASKS_SCRIPTS;

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
