/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const argv = require('yargs').argv;

/* *
 *
 *  Constants
 *
 * */

const DEFAULT_GLOBS = [
    'samples/**/*.{js,ts}'
];

// Generated files ignored by Git, but not by ESLint.
const IGNORE_GLOBS = [
    'samples/**/config.js',
    'samples/stock/demo/candlestick/demo.js',
    'samples/unit-tests/performance/highcharts-chart/demo.js',
    'samples/unit-tests/performance/test-template/demo.js'
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
 * - `-p`/`--path`: Change glob pattern.
 *   e.g. `npx gulp lint-samples -p samples/highcharts/demo/accessible-line/demo.js`
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
async function task() {

    const eslint = require('eslint');
    const log = require('../libs/log');

    const linter = new eslint.ESLint({
        overrideConfigFile: 'samples/.eslintrc',
        fix: argv.fix,
        overrideConfig: {
            ignorePatterns: IGNORE_GLOBS
        }
    });
    const globs = (
        (argv.p || argv.path) ?
            (argv.p || argv.path).split(',') :
            DEFAULT_GLOBS
    );
    const formatter = await linter.loadFormatter();

    log.message('Linting [', globs.join(', '), ']...');

    const results = await linter.lintFiles(globs);

    if (argv.fix) {
        await eslint.ESLint.outputFixes(results);
    }

    log.message(
        'Finished linting...\n',
        await formatter.format(results)
    );

    if (results.some(result => result.errorCount > 0)) {
        throw new Error('Sample linting failed.');
    }
}

gulp.task('lint-samples', task);
