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
    'samples/*/*/*/demo.js',
    'samples/*/*/*/demo.ts'
    // 'samples/*/*/*/test.js',
    // 'samples/*/*/*/unit-tests.js'
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
async function task() {

    const eslint = require('eslint');
    const log = require('../libs/log');

    const linter = new eslint.ESLint({
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
}

gulp.task('lint-samples', task);
