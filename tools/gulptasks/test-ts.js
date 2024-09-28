/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const path = require('path');
const process = require('node:process');
const yargs = require('yargs/yargs');

const { runTasks } = require('./lib/gulp');

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

const PRODUCTS_TO_TEST = ['Core', 'Dashboards'];

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
    const argv = yargs(process.argv).argv;
    const forceRun = !!(argv.browsers || argv.browsercount || argv.force || argv.tests || argv.testsAbsolutePath || argv.wait);
    const gulpLib = require('./lib/gulp');
    const log = require('../libs/log');
    const { shouldRun, saveRun } = require('./lib/test');

    if (argv.help || argv.helpme) {

        const { HELP_TEXT_COMMON } = require('./lib/test');
        log.message(`
            HIGHCHARTS TYPESCRIPT TEST RUNNER

            Available arguments for 'gulp test-ts':

            ` + HELP_TEXT_COMMON);

        return;
    }

    const runConfig = {
        configFile: CONFIGURATION_FILE,
        codeDirectory: CODE_DIRECTORY,
        jsDirectory: JS_DIRECTORY,
        testsDirectory: TESTS_DIRECTORY
    };

    const { handleProductArgs } = require('./lib/test');
    const products = handleProductArgs();

    // Skip the test if not forced or if not testing for relevant products
    if (
        !forceRun && (
            products &&
            !products.some(product => PRODUCTS_TO_TEST.includes(product))
        )
    ) {
        log.message('Skipping test-ts');
        return;
    }

    // Conditionally build required code
    await gulpLib.run('scripts', 'dashboards/scripts');

    const shouldRunTests = forceRun ||
        (await shouldRun(runConfig).catch(error => {
            log.failure(error.message);

            log.failure(
                '✖ The files have not been built' +
                ' since the last source code changes.' +
                ' Run `npx gulp` and try again.' +
                ' If this error occures constantly ' +
                ' without a reason, try `npx gulp test-ts --force`.'
            );

            return false;
        }));

    if (shouldRunTests) {

        log.message('Run `gulp test --help` for available options');

        const KarmaServer = require('karma').Server;
        const PluginError = require('plugin-error');

        const parseConfig = require('karma').config.parseConfig;
        const karmaConfig = parseConfig(KARMA_CONFIG_FILE, {
            singleRun: !argv.wait,
            client: {
                cliArgs: argv
            }
        });

        new KarmaServer(
            karmaConfig,
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

gulp.task(
    'test-ts',
    testTS
);
