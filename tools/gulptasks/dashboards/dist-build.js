/*
 * Copyright (C) Highsoft AS
 */


const fs = require('fs');
const gulp = require('gulp');
const path = require('path');


/* *
 *
 *  Functions
 *
 * */


function buildCSS(
    sourceFolder,
    targetFolder,
    release
) {

    const fsLib = require('../lib/fs');

    fsLib.copyAllFiles(
        sourceFolder,
        targetFolder,
        true,
        file => (
            path.basename(file)[0] !== '.' &&
            (
                file.includes('dashboards') ||
                file.includes('datagrid')
            )
        )
    );

    for (const cssFile of fsLib.getFilePaths(targetFolder)) {
        fs.writeFileSync(
            cssFile,
            fs
                .readFileSync(cssFile, 'utf8')
                .replace(/@product.version@/gu, release)
        );
    }

}


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
        release
    } = require('yargs').argv;

    if (!/^\d+\.\d+\.\d+(?:-\w+)?$/su.test(release)) {
        throw new Error('No valid `--release x.x.x` provided.');
    }

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
    buildCSS(cssFolder, buildCssTarget, release);
    logLib.success(`Created ${buildCssTarget}`);

    // temporary until dashboards/dist-examples task works
    const buildExamplesTarget = path.join(buildFolder, 'examples');
    fsLib.copyAllFiles(examplesFolder, buildExamplesTarget, true);
    logLib.success(`Created ${buildExamplesTarget}`);

    const buildGfxTarget = path.join(buildCodeTarget, 'gfx');
    fsLib.copyAllFiles(
        gfxFolder,
        buildGfxTarget,
        true,
        file => (
            path.basename(file)[0] !== '.' &&
            file.includes('dashboard')
        )
    );
    logLib.success(`Created ${buildGfxTarget}`);

    const JSONFilePath = path.join(buildCodeTarget, 'release.json');
    fs.writeFileSync(JSONFilePath, JSON.stringify({ version: release }));

    logLib.success(`Created ${JSONFilePath}`);

}


gulp.task('dashboards/dist-build', distBuild);
