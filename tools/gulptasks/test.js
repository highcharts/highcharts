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

        const detailsFile = f.replace(/\.html$/u, '.details');

        try {
            const details = yaml.safeLoad(
                fs.readFileSync(detailsFile, 'utf-8')
            );
            if (details.js_wrap !== 'b') {
                LogLib.failure('js_wrap not found:', detailsFile);
                errors++;
            }
        } catch {
            LogLib.failure('File not found:', detailsFile);
            errors++;
        }
    });

    if (errors) {
        throw new Error('Missing js_wrap setting');
    }
}

function checkSamplesConsistency() {
    const FSLib = require('../libs/fs.js');
    const { existsSync } = require('node:fs');
    const glob = require('glob');
    const LogLib = require('../libs/log');

    let errors = 0;

    // Avoid double-commit of demo.js and demo.ts
    glob.sync(
        FSLib.path(process.cwd() + '/samples/*/demo/*', true)
    ).forEach(p => {
        if (existsSync(FSLib.path(p + '/demo.ts'))) {
            const gitignore = FSLib.path(p + '/.gitignore');
            if (!existsSync(gitignore)) {
                LogLib.failure(
                    'Should have a .gitignore file when demo.ts exists',
                    p
                );
                errors++;
            } else {
                const content = FSLib.getFile(gitignore);
                if (!content.includes('demo.js')) {
                    LogLib.failure(
                        'Should list demo.js in .gitignore file when demo.ts exists',
                        p
                    );
                    errors++;
                }
            }
        }
    });

    if (errors) {
        throw new Error('Samples validation failed');
    }
}

/**
 * Checks if demos (public ones for the website) have valid configuration
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
    const assert = require('node:assert');
    const { existsSync } = require('node:fs');

    let errors = 0;


    glob.sync(
        FSLib.path(process.cwd() + '/samples/*/demo/*', true)
    ).forEach(p => {
        assert(existsSync(FSLib.path(p + '/demo.details')), `Missing demo.details file at ${p}`);
    });

    glob.sync(
        FSLib.path(process.cwd() + '/samples/*/*/*/demo.details', true)
    ).forEach(detailsFile => {
        detailsFile = FSLib.path(detailsFile, true);

        if (/\/samples\/(\w+)\/demo\//u.test(detailsFile)) {
            try {
                const details = yaml.load(
                    fs.readFileSync(detailsFile, 'utf-8')
                );

                if (typeof details !== 'object') {
                    throw new Error('Malformed details file');
                }

                const { name, categories: demoCategories, tags: demoTags } = details;
                if (!name || /High.*demo/u.test(name)) {
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

            } catch {
                LogLib.failure('File not found:', detailsFile);
                errors++;
            }

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

    // Recursive function to collect doc paths from sidebar
    function collectDocs(item) {
        if (Array.isArray(item)) {
            item.forEach(collectDocs);
        } else if (typeof item === 'string') {
            sidebarDocs.push(item);
        } else if (typeof item === 'object') {
            Object.values(item).forEach(collectDocs);
        }
    }

    // Start collecting docs from sidebar.docs
    collectDocs(sidebar.docs);

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
 * @param {Function} gulpback
 * Internal async function by Gulp.js.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
async function test(gulpback) {
    const argv = require('yargs').argv;
    const childProcess = require('node:child_process');
    const fs = require('node:fs');
    const logLib = require('../libs/log');
    const PluginError = require('plugin-error');

    const { shouldRun, saveRun, HELP_TEXT_COMMON } = require('./lib/test');

    if (argv.help || argv.helpme) {
        logLib.message(
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
    checkSamplesConsistency();
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
        logLib.message('No tests to run, exiting early');
        return;
    }

    // Conditionally build required code
    await gulp.task('scripts')(gulpback);

    const shouldRunTests = forceRun ||
        (await shouldRun(runConfig).catch(error => {
            logLib.failure(error.message);

            logLib.failure(
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

        logLib.message('Run `gulp test --help` for available options');

        const testArgumentParts = [];

        if (Array.isArray(productTests)) {
            testArgumentParts.push('--tests');
            productTests.forEach(testPath =>
                testArgumentParts.push(`unit-tests/${testPath}/**/demo.js`));
        }

        const result = childProcess.spawnSync('npx', [
            'karma', 'start', KARMA_CONFIG_FILE,
            testArgumentParts.join(' '),
            ...process.argv
        ], {
            cwd: process.cwd(),
            stdio: ['ignore', process.stdout, process.stderr],
            timeout: 1800000,
            shell: path.sep === path.win32.sep
        });

        if (result.error || result.status !== 0) {
            if (argv.speak) {
                logLib.say('Tests failed!');
            }
            throw new PluginError('karma', {
                message: 'Tests failed'
            });
        }

        if (argv.speak) {
            logLib.say('Tests succeeded!');
        }

        saveRun(runConfig);

        // Capture console.error, console.warn and console.log
        const consoleLogPath = `${BASE}/test/console.log`;
        const consoleLog = await fs.promises.readFile(
            consoleLogPath,
            'utf-8'
        ).catch(() => {});
        if (consoleLog) {
            const errors = (consoleLog.match(/ ERROR:/gu) || []).length,
                warnings = (consoleLog.match(/ WARN:/gu) || []).length,
                logs = (consoleLog.match(/ LOG:/gu) || []).length;

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

            logLib.message(
                `The browser console logged ${message.join(', ')}.\n` +
                'They can be reviewed in ' + consoleLogPath.cyan + '.'
            );
        }
    }
}

gulp.task('test', gulp.series('test-docs', test));
