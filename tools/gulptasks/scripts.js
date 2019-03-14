/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

/* *
 *
 *  Functions
 *
 * */

/**
 * Returns the latest timestamp of modified files.
 *
 * @param {string} globPattern
 *        Glob pattern
 *
 * @return {number}
 *         Latest timestamp of modified files
 */
function getModifiedTime(globPattern) {

    const FS = require('fs');
    const Glob = require('glob');

    return Glob
        .sync(globPattern)
        .reduce(
            (modifyTime, filePath) => Math.max(
                modifyTime, FS.statSync(filePath).mtimeMs
            ),
            0
        );
}

/**
 * Tests whether the code directory is in sync with js directory.
 *
 * @return {boolean}
 *         True, if code is out of sync.
 */
function shouldBuild() {

    return (getModifiedTime('code/**/*.js') <= getModifiedTime('js/**/*.js'));
}

/* *
 *
 *  Tasks
 *
 * */

/**
 * @return {Promise<void>}
 *         Promise to keep
 */
function task() {

    const LogLib = require('./lib/log');
    const Yargs = require('yargs');

    return new Promise(resolve => {

        const argv = Yargs.argv;

        if (shouldBuild() ||
            argv.force ||
            process.env.HIGHCHARTS_DEVELOPMENT_GULP_SCRIPTS
        ) {

            process.env.HIGHCHARTS_DEVELOPMENT_GULP_SCRIPTS = true;

            Gulp
                .series('scripts-css', 'scripts-js')(resolve);

            delete process.env.HIGHCHARTS_DEVELOPMENT_GULP_SCRIPTS;
        } else {

            LogLib.success('✓ Code up to date');

            LogLib.message(
                'Hint: Run the `scripts-watch` task to watch the js directory.'
            );

            resolve();
        }
    });
}

Gulp.task('scripts', task);
