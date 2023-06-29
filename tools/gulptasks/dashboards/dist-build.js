/*
 * Copyright (C) Highsoft AS
 */


const gulp = require('gulp');
const path = require('path');


/* *
 *
 *  Tasks
 *
 * */

/**
 * Creates the build/dist/dashboards setup.
 *
 * @return {Promise<void>}
 * Promise to keep.
 */
async function distBuild() {

    const config = require('./_config.json');
    const fsLib = require('../lib/fs');
    const logLib = require('../lib/log');

    const buildFolder = config.buildFolder;

    fsLib.deleteDirectory(buildFolder, true);
    logLib.success(`Deleted ${buildFolder}`);

    const codeTarget = path.join(buildFolder, 'code');

    fsLib.copyAllFiles(config.bundleTargetFolder, codeTarget, true);
    logLib.success(`Created ${codeTarget}`);

    const cssTarget = path.join(codeTarget, 'css');

    fsLib.copyAllFiles(
        config.cssFolder,
        cssTarget,
        true,
        file => path.basename(file)[0] !== '.'
    );
    logLib.success(`Created ${cssTarget}`);

    const examplesSourceFolder = config.examplesFolder;
    const examplesTargetFolder = path.join(config.buildFolder, 'examples');

    fsLib.copyAllFiles(examplesSourceFolder, examplesTargetFolder, true);
    logLib.success(`Created ${examplesTargetFolder}`);

    const gfxTarget = path.join(codeTarget, 'gfx');

    fsLib.copyAllFiles(config.gfxFolder, gfxTarget, true);
    logLib.success(`Created ${gfxTarget}`);

}


gulp.task('dashboards/dist-build', distBuild);
