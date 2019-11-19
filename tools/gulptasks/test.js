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
    BASE, 'node_modules', '_gulptasks_test.json'
);

const JS_DIRECTORY = path.join(BASE, 'js');

const KARMA_CONFIG_FILE = path.join(BASE, 'test', 'karma-conf.js');

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
 * @return {void}
 */
function checkSamplesConsistency() {

    const FS = require('fs');
    const LogLib = require('./lib/log');

    const products = [
        { product: 'highcharts' },
        { product: 'stock' },
        { product: 'maps' },
        { product: 'gantt', ignore: ['logistics'] }
    ];

    /**
     * @param {object} product The product information
     * @param {string} product.product Product folder name.
     * @param {array} [product.ignore=[]] List of samples that is not listed
     * in index.htm, that still should exist in the demo folder.
     */
    products.forEach(
        ({ product, ignore = [] }) => {
            const filename = path.join('samples', product, 'demo', 'index.htm');
            if (!FS.existsSync(filename)) {
                return;
            }
            const index = FS
                .readFileSync(filename)
                .toString()
                // Remove comments from the html in index
                .replace(/<!--[\s\S]*-->/gm, '');

            const regex = /href="examples\/([a-z\-0-9]+)\/index.htm"/g;
            const toc = [];

            let matches;

            while ((matches = regex.exec(index)) !== null) {
                toc.push(matches[1]);
            }

            const folders = [];
            FS
                .readdirSync(`./samples/${product}/demo`).forEach(dir => {
                    if (dir.indexOf('.') !== 0 && dir !== 'index.htm') {
                        folders.push(dir);
                    }
                });

            const missingTOC = folders.filter(
                sample => !toc.includes(sample) && !ignore.includes(sample)
            );
            const missingFolders = toc.filter(
                sample => !folders.includes(sample)
            );

            if (missingTOC.length) {
                LogLib.failure(`Found demos that were not added to ./samples/${product}/demo/index.htm`.red);
                missingTOC.forEach(sample => {
                    LogLib.failure(` - ./samples/${product}/demo/${sample}`.red);
                });

                throw new Error('Missing sample in index.htm');
            }

            if (missingFolders.length) {
                LogLib.failure(`Found demos in ./samples/${product}/demo/index.htm that were not present in demo folder`.red);
                missingFolders.forEach(sample => {
                    LogLib.failure(` - ./samples/${product}/demo/${sample}`.red);
                });

                throw new Error('Missing demo');
            }
        }
    );
}

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
            '✓ Source code and unit tests have been not modified' +
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

    A shorthand option, '--browsers all', runs all BrowserStack machines.
    
--browsercount
    Number of browserinstances to spread/shard the tests across. Default value is 2.
    Will default use ChromeHeadless browser. For other browsers specify 
    argument --splitbrowsers (same usage as above --browsers argument).

--debug
    Print some debugging info.

--force
    Forces all tests without cached results.

--speak
    Says if tests failed or succeeded.

--tests
    Comma separated list of tests to run. Defaults to '*.*' that runs all tests
    in the 'samples/' directory.
    Example: 'gulp test --tests unit-tests/chart/*' runs all tests in the chart
    directory.

--visualcompare
    Performs a visual comparison of the output and creates a reference.svg and candidate.svg
    when doing so. A JSON file with the results is produced in the location
    specified by config.imageCapture.resultsOutputPath. 

--ts
    Compile TypeScript-based tests.

`);
            return;
        }

        checkSamplesConsistency();
        checkJSWrap();

        const forceRun = !!(argv.browsers || argv.browsercount || argv.force || argv.tests);

        if (forceRun || shouldRun()) {

            LogLib.message('Run `gulp test --help` for available options');

            const KarmaServer = require('karma').Server;
            const PluginError = require('plugin-error');

            new KarmaServer(
                {
                    configFile: KARMA_CONFIG_FILE,
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

gulp.task('test', gulp.series('scripts', test));
