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

const BASE = path.join(__dirname, '..', '..');

const CODE_DIRECTORY = path.join(BASE, 'code');

const CONFIGURATION_FILE = path.join(
    BASE, 'node_modules', '_gulptasks_test-ts.json'
);

const JS_DIRECTORY = path.join(BASE, 'js');

const KARMA_CONFIG_FILE = path.join(BASE, 'test', 'typescript-karma', 'karma-conf.js');

const TESTS_DIRECTORY = path.join(BASE, 'test', 'typescript-karma');

/* *
 *
 *  Functions
 *
 * */

/**
 * Save latest hashes of:
 * - code build
 * - js build
 * - test result
 *
 * @return {void}
 */
function saveRun() {

    const FS = require('fs');
    const FSLib = require('./lib/fs');
    const StringLib = require('./lib/string');

    const latestCodeHash = FSLib.getDirectoryHash(
        CODE_DIRECTORY, true, StringLib.removeComments
    );
    const latestJsHash = FSLib.getDirectoryHash(
        JS_DIRECTORY, true, StringLib.removeComments
    );
    const latestTestsHash = FSLib.getDirectoryHash(
        TESTS_DIRECTORY, true, StringLib.removeComments
    );

    const configuration = {
        latestCodeHash,
        latestJsHash,
        latestTestsHash
    };

    FS.writeFileSync(CONFIGURATION_FILE, JSON.stringify(configuration));
}

/**
 * Check if we have to rebuild sources, or we are good.
 * We are good for example when changing demos, tooling etc.
 * without touching the source code (TS files).
 *
 * @return {boolean}
 *         True if outdated
 */
function shouldRun() {

    const fs = require('fs');
    const fsLib = require('./lib/fs');
    const logLib = require('./lib/log');
    const stringLib = require('./lib/string');

    let configuration = {
        latestCodeHash: '',
        latestJsHash: '',
        latestTestsHash: ''
    };

    if (fs.existsSync(CONFIGURATION_FILE)) {
        configuration = JSON.parse(
            fs.readFileSync(CONFIGURATION_FILE).toString()
        );
    }

    const latestCodeHash = fsLib.getDirectoryHash(
        CODE_DIRECTORY, true, stringLib.removeComments
    );
    const latestJsHash = fsLib.getDirectoryHash(
        JS_DIRECTORY, true, stringLib.removeComments
    );
    const latestTestsHash = fsLib.getDirectoryHash(
        TESTS_DIRECTORY, true, stringLib.removeComments
    );

    if (latestCodeHash === configuration.latestCodeHash &&
        latestJsHash !== configuration.latestJsHash
    ) {

        logLib.failure(
            '✖ The files have not been built' +
            ' since the last source code changes.' +
            ' Run `npx gulp` and try again.' +
            ' If this error occures contantly ' +
            ' without a reason, then remove ' +
            '`node_modules/_gulptasks_*.json` files.'
        );

        throw new Error('Code out of sync');
    }

    if (latestCodeHash === configuration.latestCodeHash &&
        latestTestsHash === configuration.latestTestsHash
    ) {

        logLib.success(
            '✓ Source code and unit tests have not been modified' +
            ' since the last successful test run.'
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
 * Run the test suite.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function testTS() {

    const LogLib = require('./lib/log');
    const Yargs = require('yargs');

    return new Promise((resolve, reject) => {

        const argv = Yargs.argv;

        if (argv.help) {
            LogLib.message(`
HIGHCHARTS TYPESCRIPT TEST RUNNER

Available arguments for 'gulp test':

--browsers
    Comma separated list of browsers to test. Available browsers are
    'ChromeHeadless, Chrome, Firefox, Safari, Edge, IE' depending on what is
    installed on the local system. Defaults to ChromeHeadless.

    In addition, virtual browsers from Browserstack are supported. They are
    prefixed by the operating system. Available BrowserStack browsers are
    'Mac.Chrome, Mac.Firefox, Mac.Safari, Win.Chrome, Win.Edge, Win.Firefox,
    Win.IE'.

    For debugging in Visual Studio Code, use 'ChromeHeadless.Debugging'.

    A shorthand option, '--browsers all', runs all BrowserStack machines.

--browsercount
    Number of browserinstances to spread/shard the tests across. Default value is 2.
    Will default use ChromeHeadless browser. For other browsers specify
    argument --splitbrowsers (same usage as above --browsers argument).

--debug
    Skips rebuilding and prints some debugging info.

--force
    Forces all tests without cached results.

--speak
    Says if tests failed or succeeded.

--tests
    Comma separated list of tests to run. Defaults to '*.*' that runs all tests
    in the 'test/typescript-karma/' directory.
    Example: 'gulp test --tests chart/*/*' runs all tests in the chart
    directory.

--testsAbsolutePath
    Comma separated list of tests to run. By default runs all tests
    in the 'test/typescript-karma/' directory.
    Example:
    'gulp test --testsAbsolutePath /User/{userName}/{path}/{to}/highcharts/test/typescript-karma/3d/axis/demo.js'
    runs all tests in the file.

--visualcompare
    Performs a visual comparison of the output and creates a reference.svg and candidate.svg
    when doing so. A JSON file with the results is produced in the location
    specified by config.imageCapture.resultsOutputPath.

`);
            return;
        }

        const forceRun = !!(argv.browsers || argv.browsercount || argv.force || argv.tests || argv.testsAbsolutePath || argv.wait);

        if (forceRun || shouldRun()) {

            LogLib.message('Run `gulp test --help` for available options');

            const KarmaServer = require('karma').Server;
            const PluginError = require('plugin-error');

            new KarmaServer(
                {
                    configFile: KARMA_CONFIG_FILE,
                    singleRun: !argv.wait,
                    client: {
                        cliArgs: argv
                    }
                },
                err => {

                    if (err !== 0) {

                        if (argv.speak) {
                            LogLib.say('Tests failed!');
                        }

                        reject(new PluginError('karma', {
                            message: 'Tests failed'
                        }));

                        return;
                    }

                    try {
                        saveRun();
                    } catch (catchedError) {
                        LogLib.warn(catchedError);
                    }

                    if (argv.speak) {
                        LogLib.say('Tests succeeded!');
                    }

                    resolve();
                }
            ).start();
        } else {

            resolve();
        }
    });
}

gulp.task('test-ts', gulp.series('dashboards/scripts', 'scripts', testTS));
