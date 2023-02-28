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
function checkDemosConsistency() {
    const fs = require('fs');
    const pages = require('../../samples/demo-config');

    // Get categories and tags from the demo config
    const tags = [],
        categories = [];

    Object.keys(pages).forEach(key => {
        const page = pages[key];
        if (page.filter && page.filter.tags) {
            tags.push(...page.filter.tags);
        }
        if (page.categories) {
            categories.push(...page.categories);
        }
    });

    const glob = require('glob');
    const logLib = require('./lib/log');
    const yaml = require('js-yaml');

    let errors = 0;

    glob.sync(
        process.cwd() + '/samples/+(highcharts|stock|maps|gantt)/*/*/demo.details'
    ).forEach(detailsFile => {

        if (/\/samples\/(highcharts|stock|maps|gantt)\/demo\//u.test(detailsFile)) {
            try {
                const details = yaml.load(
                    fs.readFileSync(detailsFile, 'utf-8')
                );

                if (typeof details !== 'object') {
                    throw new Error('Malformed details file');
                }

                const { name, categories: demoCategories, tags: demoTags } = details;
                if (!name || /High.*demo/.test(name)) {
                    logLib.failure('no name set, or default name used:', detailsFile);
                    errors++;
                }

                if (!demoCategories || !demoCategories.length) {
                    logLib.failure('no categories found:', detailsFile);
                    errors++;
                } else {
                    if (!demoCategories.every(category => categories.includes(typeof category === 'object' ? Object.keys(category)[0] : category))) {
                        logLib.failure('one or more categories are missing from demo-config:', detailsFile);
                        errors++;
                    }
                }

                if (!demoTags || !demoTags.length) {
                    logLib.failure('no tags found:', detailsFile);
                    errors++;
                } else {
                    if (!demoTags.every(tag => tag === 'unlisted' || tags.includes(tag))) {
                        logLib.failure('one or more tags are missing from demo-config:', detailsFile);
                        errors++;
                    }
                }

            } catch (e) {
                logLib.failure('File not found:', detailsFile);
                errors++;
            }

        } else {
            try {
                const details = yaml.load(
                    fs.readFileSync(detailsFile, 'utf-8')
                );

                if (typeof details === 'object') {
                    if (details.categories) {
                        logLib.failure(
                            'categories should not be used in demo.details outside demo folder',
                            detailsFile
                        );
                        errors++;
                    } else if (details.tags) {
                        logLib.failure(
                            'tags should not be used in demo.details outside demo folder',
                            detailsFile
                        );
                        errors++;
                    }
                }
            // eslint-disable-next-line
            } catch (e) {}
        }
    });

    if (errors) {
        throw new Error('Demo validation failed');
    }
}

/**
 * @async
 * @return {void}
 */
function checkDocsConsistency() {
    const FS = require('fs');
    const LogLib = require('./lib/log');

    const sidebar = require('../../docs/sidebars.js');
    const { unlisted } = require('../../docs/doc-config.js');
    const sidebarDocs = [];

    Object
        .keys(sidebar.docs)
        .forEach(key => sidebarDocs.push(...Object.values(sidebar.docs[key])));

    const dirs = FS.readdirSync('docs/');
    const foundDocs = [];

    try {
        dirs.forEach(dir => {
            if (FS.statSync('docs/' + dir).isDirectory()) {
                FS.readdirSync(path.join('docs/', dir))
                    .filter(file => FS.statSync(path.join('docs/', dir, file)).isFile() && path.extname(file) === '.md')
                    .forEach(file => {
                        foundDocs.push(dir + '/' + file.replace('.md', ''));
                    });
            }
        });
    } catch (error) {
        throw new Error(error);
    }
    const docsNotAdded = foundDocs.filter(file => {
        if (unlisted.includes(file)) {
            return false;
        }
        return !sidebarDocs.includes(file);
    });

    if (docsNotAdded.length > 0) {
        LogLib.failure(`❌  Found ${docsNotAdded.length} docs not added to '/docs/sidebars.js' or '/docs/doc-config.js':`);
        docsNotAdded.forEach(file => LogLib.warn(`   '${file}'`));
        throw new Error('Docs not added to sidebar');
    }
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

--testsAbsolutePath
    Comma separated list of tests to run. By default runs all tests
    in the 'samples/' directory.
    Example:
    'gulp test --testsAbsolutePath /User/{userName}/{path}/{to}/highcharts/samples/unit-tests/3d/axis/demo.js'
    runs all tests in the file.

--visualcompare
    Performs a visual comparison of the output and creates a reference.svg and candidate.svg
    when doing so. A JSON file with the results is produced in the location
    specified by config.imageCapture.resultsOutputPath.

--ts
    Compile TypeScript-based tests.

--dots
    Use the less verbose 'dots' reporter

--timeout
    Set a different disconnect timeout from default config

`);
            return;
        }
        checkDocsConsistency();
        checkDemosConsistency();
        checkJSWrap();

        const forceRun = !!(argv.browsers || argv.browsercount || argv.force || argv.tests || argv.testsAbsolutePath);

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

gulp.task('test', gulp.series('scripts', test));
