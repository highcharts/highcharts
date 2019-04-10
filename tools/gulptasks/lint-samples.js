/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');
const argv = require('yargs').argv;

/* *
 *
 *  Constants
 *
 * */

const DEFAULT_GLOBS = [
    'samples/*/*/*/demo.js',
    'samples/*/*/*/test.js',
    'samples/*/*/*/unit-tests.js'
];

const IGNORE_GLOBS = [
    'samples/highcharts/common-js/*/demo.js',
    'samples/cloud/*/*/demo.js'
];

/* *
 *
 *  Tasks
 *
 * */

/**
 * Gulp task to execute ESLint on samples.
 *
 * Command line arguments:
 *
 * - `--fix`: Fix eslint failures
 *
 * - `-p`/`--path`: Change glob pattern. e.g. `npx gulp lint -p './samples/**'`
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function task() {

    const ESLint = require('eslint');
    const LogLib = require('./lib/log');

    return new Promise(resolve => {

        const cli = new ESLint.CLIEngine({
            fix: argv.fix,
            ignorePattern: IGNORE_GLOBS
        });
        const globs = (
            (argv.p || argv.path) ?
                (argv.p || argv.path).split(',') :
                DEFAULT_GLOBS
        );

        LogLib.message('Linting [', globs.join(', '), ']...');

        const report = cli.executeOnFiles(globs);

        if (argv.fix) {
            ESLint.CLIEngine.outputFixes(report);
        }

        LogLib.message(
            'Finished linting...\n',
            cli.getFormatter()(report.results)
        );

        resolve();
    });
}

Gulp.task('lint-samples', task);
