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
async function testTS() {
    const log = require('./lib/log');
    const Yargs = require('yargs');
    const { shouldRun, saveRun } = require('./lib/test');


    const argv = Yargs.argv;

    if (argv.help) {
        log.message(`
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

    const runConfig = {
        configFile: CONFIGURATION_FILE,
        codeDirectory: CODE_DIRECTORY,
        jsDirectory: JS_DIRECTORY,
        testsDirectory: TESTS_DIRECTORY
    };

    const shouldRunTests = forceRun ||
        (await shouldRun(runConfig).catch(error => {
            log.failure(error.message);

            log.failure(
                '✖ The files have not been built' +
                ' since the last source code changes.' +
                ' Run `npx gulp` and try again.' +
                ' If this error occures contantly ' +
                ' without a reason, try `npx gulp test-ts --force`.'
            );

            return false;
        }));

    if (shouldRunTests) {

        log.message('Run `gulp test --help` for available options');

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
                        log.say('Tests failed!');
                    }

                    throw (new PluginError('karma', {
                        message: 'Tests failed'
                    }));

                }

                try {
                    saveRun(runConfig);
                } catch (catchedError) {
                    log.warn(catchedError);
                }

                if (argv.speak) {
                    log.say('Tests succeeded!');
                }

            }
        ).start();
    }
}

gulp.task('test-ts', gulp.series('dashboards/scripts', 'scripts', testTS));
