/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

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

    const eslint = require('eslint');
    const log = require('./lib/log');

    return new Promise(resolve => {

        const argv = process.argv;
        const cli = new eslint.CLIEngine({ fix: argv.fix });
        const glob = (
            (argv.p || argv.path) ?
                (argv.p || argv.path).split(',') :
                DEFAULT_GLOBS
        );

        log.message('Linting [', glob.join(', '), '] ...');

        const report = cli.executeOnFiles(glob);

        if (argv.fix) {
            cli.outputFixes(report);
        }

        log.success('Finished linting');
        log.message(cli.getFormatter()(report.results));

        resolve();
    });
}

gulp.task('lint-js', task);
