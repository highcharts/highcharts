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
    const LogLib = require('../libs/log');
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
 * Checks if demos has valid configuration
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
    const FSLib = require('../libs/fs.js');
    const LogLib = require('../libs/log');
    const yaml = require('js-yaml');

    let errors = 0;

    glob.sync(
        FSLib.path(process.cwd() + '/samples/+(highcharts|stock|maps|gantt)/*/*/demo.details', true)
    ).forEach(detailsFile => {
        detailsFile = FSLib.path(detailsFile, true);

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
                    LogLib.failure('no name set, or default name used:', detailsFile);
                    errors++;
                }

                if (!demoCategories || !demoCategories.length) {
                    LogLib.failure('no categories found:', detailsFile);
                    errors++;
                } else {
                    if (!demoCategories.every(category => categories.includes(typeof category === 'object' ? Object.keys(category)[0] : category))) {
                        LogLib.failure('one or more categories are missing from demo-config:', detailsFile);
                        errors++;
                    }
                }

                if (!demoTags || !demoTags.length) {
                    LogLib.failure('no tags found:', detailsFile);
                    errors++;
                } else {
                    if (!demoTags.some(tag => tag === 'unlisted' || tags.includes(tag))) {
                        LogLib.failure('demo.details should include at least one tag from demo-config.js ', detailsFile);
                        errors++;
                    }
                }

            } catch (e) {
                LogLib.failure('File not found:', detailsFile);
                errors++;
            }

        } else {
            try {
                const details = yaml.load(
                    fs.readFileSync(detailsFile, 'utf-8')
                );

                if (typeof details === 'object') {
                    if (details.categories) {
                        LogLib.failure(
                            'categories should not be used in demo.details outside demo folder',
                            detailsFile
                        );
                        errors++;
                    } else if (details.tags) {
                        LogLib.failure(
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
 * Checks if documentation is added to sidebar file
 * @async
 * @return {Promise<void>}
 */
function checkDocsConsistency() {
    const FS = require('fs');
    const LogLib = require('../libs/log');

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

    // Check links and references to samples

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
async function test() {
    const fs = require('fs');
    const argv = require('yargs').argv;
    const log = require('../libs/log');

    const { shouldRun, saveRun, HELP_TEXT_COMMON } = require('./lib/test');

    if (argv.help || argv.helpme) {
        log.message(
            `HIGHCHARTS TYPESCRIPT TEST RUNNER

Available arguments for 'gulp test':` +
            HELP_TEXT_COMMON +
            `--visualcompare
Performs a visual comparison of the output and creates a reference.svg and candidate.svg
when doing so. A JSON file with the results is produced in the location
specified by config.imageCapture.resultsOutputPath.
            `
        );
        return;
    }

    checkDocsConsistency();
    checkDemosConsistency();
    checkJSWrap();

    const forceRun = !!(
        argv.browsers ||
        argv.browsercount ||
        argv.force ||
        argv.tests ||
        argv.testsAbsolutePath
    );
    const runConfig = {
        configFile: CONFIGURATION_FILE,
        codeDirectory: CODE_DIRECTORY,
        jsDirectory: JS_DIRECTORY,
        testsDirectory: TESTS_DIRECTORY
    };

    const { getProductTests } = require('./lib/test');
    const productTests = getProductTests();

    // If false, there's no modified products
    // If undefined, there's no product argument, so fall back to karma config
    if (productTests === false) {
        log.message('No tests to run, exiting early');
        return;
    }

    // Conditionally build required code
    await gulp.task('scripts')();

    const shouldRunTests = forceRun ||
        (await shouldRun(runConfig).catch(error => {
            log.failure(error.message);

            log.failure(
                '✖ The files have not been built' +
                ' since the last source code changes.' +
                ' Run `npx gulp` and try again.' +
                ' If this error occures contantly ' +
                ' without a reason, then remove ' +
                '`node_modules/_gulptasks_*.json` files.'
            );

            return false;
        }));

    if (shouldRunTests) {

        log.message('Run `gulp test --help` for available options');

        const KarmaServer = require('karma').Server;
        const { parseConfig } = require('karma').config;

        const PluginError = require('plugin-error');
        const {
            reporters: defaultReporters,
            browserDisconnectTimeout: defaultTimeout
        } = require(KARMA_CONFIG_FILE);

        const karmaConfig = parseConfig(KARMA_CONFIG_FILE, {
            reporters: argv.dots ? ['dots'] : defaultReporters,
            browserDisconnectTimeout: typeof argv.timeout === 'number' ? argv.timeout : defaultTimeout,
            singleRun: true,
            tests: Array.isArray(productTests) ?
                productTests.map(testPath => `samples/unit-tests/${testPath}/**/demo.js`) :
                void 0,
            client: {
                cliArgs: argv
            }
        });

        await new Promise((resolve, reject) => new KarmaServer(
            karmaConfig,
            err => {

                // Force exit in BrowserStack GitHub Action
                // eslint-disable-next-line node/no-process-exit
                setTimeout(() => process.exit(err), 3000);

                if (err !== 0) {

                    if (argv.speak) {
                        log.say('Tests failed!');
                    }

                    reject(new PluginError('karma', {
                        message: 'Tests failed'
                    }));

                    return;
                }

                try {
                    saveRun(runConfig);
                } catch (catchedError) {
                    log.warn(catchedError);
                }

                if (argv.speak) {
                    log.say('Tests succeeded!');
                }

                resolve();
            }
        ).start());

        // Capture console.error, console.warn and console.log
        const consoleLogPath = `${BASE}/test/console.log`;
        const consoleLog = await fs.promises.readFile(
            consoleLogPath,
            'utf-8'
        ).catch(() => {});
        if (consoleLog) {
            const errors = (consoleLog.match(/ ERROR:/g) || []).length,
                warnings = (consoleLog.match(/ WARN:/g) || []).length,
                logs = (consoleLog.match(/ LOG:/g) || []).length;

            const message = [];
            if (errors) {
                message.push(`${errors} errors`.red);
            }
            if (warnings) {
                message.push(`${warnings} warnings`.yellow);
            }
            if (logs) {
                message.push(`${logs} logs`);
            }

            log.message(
                `The browser console logged ${message.join(', ')}.\n` +
                'They can be reviewed in ' + consoleLogPath.cyan + '.'
            );
        }

    }
}

gulp.task('test', gulp.series('test-docs', test));
