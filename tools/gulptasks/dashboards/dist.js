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
    const logLib = require('../../libs/log');

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
require('./dist-release.js');
require('./dist-upload.js');
require('./dist-zip.js');
require('./scripts.js');
const scriptsCompile = require('../scripts-compile');
const { distVerify } = require('../dist-verify.js');
const { distProductsJS } = require('../dist-productsjs.js');


gulp.task(
    'dashboards/dist',
    gulp.series(
        () => dist(),
        'dashboards/scripts',
        () => scriptsCompile(void 0, require('./_config.json'), 'dashboards'),
        () => scriptsCompile(void 0, require('./_config.json'), 'datagrid'),
        'dashboards/dist-build',
        'dashboards/dist-examples',
        'dashboards/dist-zip',
        () => distProductsJS({ dashboards: true, release: argv.release }),
        'dashboards/dist-release',
        () => distVerify({ dashboards: true })
    )
);
