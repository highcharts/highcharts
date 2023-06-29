/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Tasks
 *
 * */

async function dist() {

    const argv = require('yargs').argv;
    const gulpLib = require('../lib/gulp');
    const logLib = require('../lib/log');

    if (!argv.release) {
        logLib.failure('Missing version');
        logLib.warn(
            'You have to specify the release version',
            'with the `--release x.x.x` argument.'
        );
        throw new Error('Arguments Error');
    }

    await gulpLib.requires([], [
        'dashboards/scripts',
        'dashboards/dist-minify',
        'dashboards/dist-build',
        'dashboards/dist-zip',
        'dashboards/dist-copy'
    ]);

}

require('./dist-build.js');
require('./dist-copy.js');
require('./dist-minify.js');
require('./dist-zip.js');
require('./scripts.js');

gulp.task('dashboards/dist', dist);
