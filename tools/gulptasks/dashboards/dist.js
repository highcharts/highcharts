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

    if (argv.h || argv.help) {
        logLib.warn(`
Highcharts Dashboards Dist Task
===============================

npx gulp dashboards/dist --release [x.x.x]

Options:

  --dry      Dry run without git commit of dashboards-dist.

  --release  Sets the release version. (required)

  --verbose  Detailed information during dist-zip.

`);

        return;
    }

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
        'dashboards/dist-release',
        'dashboards/dist-upload'
    ]);

}

require('./dist-build.js');
require('./dist-release.js');
require('./dist-minify.js');
require('./dist-upload.js');
require('./dist-zip.js');
require('./scripts.js');

gulp.task('dashboards/dist', dist);
