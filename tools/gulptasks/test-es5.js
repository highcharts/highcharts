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
    BASE, 'node_modules', '_gulptasks_test-es5.json'
);

const JS_DIRECTORY = path.join(BASE, 'js');

const KARMA_CONFIG_FILE = path.join(BASE, 'test', 'karma-conf-es5.js');

const TESTS_DIRECTORY = path.join(BASE, 'samples', 'unit-tests');

/* *
 *
 *  Functions
 *
 * */

/**
 * Check that each demo.details has the correct js_wrap setting required for it
 * it to display correctly on jsFiddle.
 *
 * @return {void}
 */
function checkJSWrap() {

    const fs = require('fs');
    const glob = require('glob');
    const logLib = require('./lib/log');
    const yaml = require('js-yaml');

    let errors = 0;

    glob.sync(
        process.cwd() + '/samples/+(highcharts|stock|maps|gantt)/**/demo.html'
    ).forEach(f => {

        const detailsFile = f.replace(/\.html$/, '.details');

        try {
            const details = yaml.safeLoad(
                fs.readFileSync(detailsFile, 'utf-8')
            );
            if (details.js_wrap !== 'b') {
                logLib.failure('js_wrap not found:', detailsFile);
                errors++;
            }
        } catch (e) {
            logLib.failure('File not found:', detailsFile);
            errors++;
        }
    });

    if (errors) {
        throw new Error('Missing js_wrap setting');
    }
}

/**
 * Saves run.
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
 * Checks if should run tests.
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
            ' Run `npx gulp` and try again.'
        );

        throw new Error('Code out of sync');
    }

    if (latestCodeHash === configuration.latestCodeHash &&
        latestTestsHash === configuration.latestTestsHash
    ) {

        logLib.success(
            '✓ Source code and unit tests not have been modified' +
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
function test() {

    const LogLib = require('./lib/log');
    const Yargs = require('yargs');

    return new Promise((resolve, reject) => {

        const argv = Yargs.argv;

        if (argv.help) {
            LogLib.message(`
HIGHCHARTS TEST RUNNER

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
    in the 'samples/' directory.
    Example: 'gulp test --tests unit-tests/chart/*' runs all tests in the chart
    directory.

--dots
    Use the less verbose 'dots' reporter

--timeout
    Set a different disconnect timeout from default config

`);
            return;
        }
        checkJSWrap();

        const forceRun = !!(argv.browsers || argv.browsercount || argv.force || argv.tests);

        if (forceRun || shouldRun()) {

            LogLib.message('Run `gulp test --help` for available options');

            const KarmaServer = require('karma').Server;
            const PluginError = require('plugin-error');
            const {
                reporters: defaultReporters,
                browserDisconnectTimeout: defaultTimeout
            } = require(KARMA_CONFIG_FILE);

            new KarmaServer(
                {
                    configFile: KARMA_CONFIG_FILE,
                    reporters: argv.dots ? ['dots'] : defaultReporters,
                    browserDisconnectTimeout: typeof argv.timeout === 'number' ? argv.timeout : defaultTimeout,
                    singleRun: true,
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

gulp.task('test-es5', gulp.series('scripts', test));
