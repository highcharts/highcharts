/*
 * Copyright (C) Highsoft AS
 */


const gulp = require('gulp');


/* *
 *
 *  Constants
 *
 * */


const HELPME = `
Highcharts Dashboards - Dist Task
=================================

npx gulp dashboards/dist --release [x.x.x]

Options:

  --dryrun   Dry run without git commit of dashboards-dist.
  --helpme   This help.
  --release  Sets the release version. (required)
  --verbose  Detailed information during dist-zip.

`;


/* *
 *
 *  Tasks
 *
 * */


async function dist() {
    const argv = require('yargs').argv;
    const logLib = require('../lib/log');

    if (argv.helpme) {
        // eslint-disable-next-line no-console
        console.log(HELPME);
        return;
    }

    if (!/^\d+\.\d+\.\d+(?:-\w+)?$/su.test(argv.release)) {
        throw new Error('No `--release x.x.x` provided.');
    }

    logLib.warn('Don\'t forget `npx gulp dashboards/dist-upload`.');

}

require('./dist-build.js');
require('./dist-examples.js');
require('./dist-productsjs.js');
require('./dist-release.js');
require('./dist-upload.js');
require('./dist-zip.js');
require('./scripts.js');
const scriptsCompile = require('../scripts-compile');
const { distVerify } = require('../dist-verify.js');

gulp.task(
    'dashboards/dist',
    gulp.series(
        () => dist(),
        'dashboards/scripts',
        () => scriptsCompile(void 0, require('./_config.json')),
        'dashboards/dist-build',
        'dashboards/dist-examples',
        'dashboards/dist-zip',
        'dashboards/dist-productsjs',
        'dashboards/dist-release',
        () => distVerify({ dashboards: true })
    )
);
