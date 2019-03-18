/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const DEFAULT_GLOBS = [
    'js/**/*.js'
];

/* *
 *
 *  Tasks
 *
 * */

/**
 * Gulp task to execute ESLint. Glob pattern defaults to `js/**`.
 *
 * Command line arguments:
 * - `--fix`: Fix eslint failures
 * - `-p`/`--path`: Change glob pattern
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function task() {

    const ESLint = require('eslint');
    const LogLib = require('./lib/log');

    return new Promise(resolve => {

        const argv = process.argv;
        const cli = new ESLint.CLIEngine({ fix: argv.fix });
        const glob = (
            (argv.p || argv.path) ?
                (argv.p || argv.path).split(',') :
                DEFAULT_GLOBS
        );

        LogLib.message('Linting [', glob.join(', '), '] ...');

        const report = cli.executeOnFiles(glob);

        if (argv.fix) {
            cli.outputFixes(report);
        }

        LogLib.success('Finished linting');
        LogLib.message(cli.getFormatter()(report.results));

        resolve();
    });
}

Gulp.task('lint-js', task);
