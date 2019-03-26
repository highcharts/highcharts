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

const BASE = Path.join(__dirname, '..', '..');

const CODE_DIRECTORY = Path.join(BASE, 'code');

const CONFIGURATION_FILE = Path.join(
    BASE, 'node_modules', '_gulptasks_test.json'
);

const JS_DIRECTORY = Path.join(BASE, 'js');

const KARMA_CONFIG_FILE = Path.join(BASE, 'test', 'karma-conf.js');

const TESTS_DIRECTORY = Path.join(BASE, 'samples', 'unit-tests');

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

    const FS = require('fs');
    const Glob = require('glob');
    const LogLib = require('./lib/log');
    const YAML = require('js-yaml');

    let errors = 0;

    Glob.sync(
        process.cwd() + '/samples/+(highcharts|stock|maps|gantt)/**/demo.html'
    ).forEach(f => {

        const detailsFile = f.replace(/\.html$/, '.details');

        try {
            const details = YAML.safeLoad(
                FS.readFileSync(detailsFile, 'utf-8')
            );
            if (details.js_wrap !== 'b') {
                LogLib.failure('js_wrap not found:', detailsFile);
                errors++;
            }
        } catch (e) {
            LogLib.failure('File not found:', detailsFile);
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
            const index = FS
                .readFileSync(
                    Path.join('samples', product, 'demo', 'index.htm')
                )
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

    const FS = require('fs');
    const FSLib = require('./lib/fs');
    const LogLib = require('./lib/log');
    const StringLib = require('./lib/string');

    let configuration = {
        latestCodeHash: '',
        latestJsHash: '',
        latestTestsHash: ''
    };

    if (FS.existsSync(CONFIGURATION_FILE)) {
        configuration = JSON.parse(
            FS.readFileSync(CONFIGURATION_FILE).toString()
        );
    }

    const latestCodeHash = FSLib.getDirectoryHash(
        CODE_DIRECTORY, true, StringLib.removeComments
    );
    const latestJsHash = FSLib.getDirectoryHash(
        JS_DIRECTORY, true, StringLib.removeComments
    );
    const latestTestsHash = FSLib.getDirectoryHash(
        TESTS_DIRECTORY, true, StringLib.removeComments
    );

    if (latestCodeHash === configuration.latestCodeHash &&
        latestJsHash !== configuration.latestJsHash
    ) {

        LogLib.failure(
            '✖ The files have not been built' +
            ' since the last source code changes.' +
            ' Run `npx gulp` and try again.'
        );

        throw new Error('Code out of sync');
    }

    if (latestCodeHash === configuration.latestCodeHash &&
        latestTestsHash === configuration.latestTestsHash
    ) {

        LogLib.success(
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

    A shorthand option, '--browsers all', runs all BroserStack machines.

--debug
    Print some debugging info.

--speak
    Says if tests failed or succeeded.

--tests
    Comma separated list of tests to run. Defaults to '*.*' that runs all tests
    in the 'samples/' directory.
    Example: 'gulp test --tests unit-tests/chart/*' runs all tests in the chart
    directory.

`);
            return;
        }

        checkSamplesConsistency();
        checkJSWrap();

        const forceRun = (Object.keys(argv).length > 2);

        if (forceRun || shouldRun()) {

            LogLib.message('Run `gulp test --help` for available options');

            const KarmaServer = require('karma').Server;
            const PluginError = require('plugin-error');

            new KarmaServer(
                {
                    configFile: KARMA_CONFIG_FILE,
                    singleRun: true
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

                    if (!forceRun) {
                        try {
                            saveRun();
                        } catch (cathedError) {
                            LogLib.warn(cathedError);
                        }
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

Gulp.task('test', Gulp.series('scripts', test));
