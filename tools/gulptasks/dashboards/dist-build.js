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
 * Creates the ./build/dist/dashboards setup.
 *
 * @return {Promise<void>}
 * Promise to keep.
 */
async function distBuild() {

    const fsLib = require('../lib/fs');
    const logLib = require('../lib/log');

    const {
        buildFolder,
        bundleTargetFolder,
        cssFolder,
        examplesFolder,
        gfxFolder
    } = require('./_config.json');

    fsLib.deleteDirectory(buildFolder, true);
    logLib.success(`Deleted ${buildFolder}`);

    const buildCodeTarget = path.join(buildFolder, 'code');

    fsLib.copyAllFiles(bundleTargetFolder, buildCodeTarget, true);
    logLib.success(`Created ${buildCodeTarget}`);

    const buildCssTarget = path.join(buildCodeTarget, 'css');

    fsLib.copyAllFiles(
        cssFolder,
        buildCssTarget,
        true,
        file => path.basename(file)[0] !== '.'
    );
    logLib.success(`Created ${buildCssTarget}`);

    const examplesSourceFolder = examplesFolder;
    const examplesTargetFolder = path.join(buildFolder, 'examples');

    fsLib.copyAllFiles(examplesSourceFolder, examplesTargetFolder, true);
    logLib.success(`Created ${examplesTargetFolder}`);

    const buildGfxTarget = path.join(buildCodeTarget, 'gfx');

    fsLib.copyAllFiles(gfxFolder, buildGfxTarget, true);
    logLib.success(`Created ${buildGfxTarget}`);

}


gulp.task('dashboards/dist-build', distBuild);
