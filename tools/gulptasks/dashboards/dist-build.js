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


async function buildCSS() {
    const fsLib = require('../../libs/fs');
    const logLib = require('../../libs/log');
    let { release } = require('yargs').argv;

    if (!/^\d+\.\d+\.\d+(?:-\w+)?$/su.test(release)) {
        if (process.env.DASH_RELEASE) {
            release = process.env.DASH_RELEASE;
        } else {
            throw new Error('No valid `--release x.x.x` provided.');
        }
    }

    const {
        buildFolder,
        buildFolderDataGrid

    } = require('./_config.json');

    function replaceVersionInFile(file) {
        fs.writeFileSync(
            file,
            fs
                .readFileSync(file, 'utf8')
                .replace(/@product.version@/gu, release)
        );
    }

    const buildCodeTargetDashboards = path.join(buildFolder, 'code');
    const buildCodeTargetDataGrid = path.join(buildFolderDataGrid, 'code');
    const buildCssTargetDashboards = path.join(buildCodeTargetDashboards, 'css');
    const buildCssTargetDataGrid = path.join(buildCodeTargetDataGrid, 'css');

    fsLib.copyAllFiles(buildCssTargetDataGrid, buildCssTargetDataGrid);
    fsLib.copyAllFiles(buildCssTargetDashboards, buildCssTargetDashboards);


    for (const cssFile of fsLib.getFilePaths(buildCssTargetDashboards)) {
        replaceVersionInFile(cssFile);
    }

    for (const cssFile of fsLib.getFilePaths(buildCssTargetDataGrid)) {
        replaceVersionInFile(cssFile);
    }

    logLib.success(`Created ${buildCssTargetDashboards} and ${buildCssTargetDataGrid}`);
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
async function distBuildDashboards() {
    const fsLib = require('../../libs/fs');
    const logLib = require('../../libs/log');
    let { release } = require('yargs').argv;

    if (!/^\d+\.\d+\.\d+(?:-\w+)?$/su.test(release)) {
        if (process.env.DASH_RELEASE) {
            release = process.env.DASH_RELEASE;
        } else {
            throw new Error('No valid `--release x.x.x` provided.');
        }
    }

    const {
        buildFolder,
        bundleTargetFolder,
        cssFolder,
        gfxFolder
    } = require('./_config.json');

    fsLib.deleteDirectory(buildFolder, true);
    logLib.success(`Deleted ${buildFolder}`);

    const buildCodeTarget = path.join(buildFolder, 'code');
    fsLib.copyAllFiles(bundleTargetFolder, buildCodeTarget, true);
    logLib.success(`Created ${buildCodeTarget}`);


    const buildGfxTarget = path.join(buildCodeTarget, 'gfx');
    fsLib.copyAllFiles(
        gfxFolder,
        buildGfxTarget,
        true,
        file => (
            path.basename(file)[0] !== '.' &&
            file.includes('dashboards')
        )
    );
    logLib.success(`Created ${buildGfxTarget}`);
}

/**
 * Creates the ./build/dist/datagrid setup.
 *
 * @return {Promise<void>}
 * Promise to keep.
 */
async function distBuildDataGrid() {
    const fsLib = require('../../libs/fs');
    const logLib = require('../../libs/log');
    let { release } = require('yargs').argv;

    if (!/^\d+\.\d+\.\d+(?:-\w+)?$/su.test(release)) {
        if (process.env.DASH_RELEASE) {
            release = process.env.DASH_RELEASE;
        } else {
            throw new Error('No valid `--release x.x.x` provided.');
        }
    }

    const {
        buildFolder,
        buildFolderDataGrid,
        bundleTargetFolderDataGrid
    } = require('./_config.json');

    fsLib.deleteDirectory(buildFolderDataGrid, true);
    logLib.success(`Deleted ${buildFolderDataGrid}`);

    const buildCodeDataGridTarget = path.join(buildFolderDataGrid, 'code');
    fsLib.copyAllFiles(bundleTargetFolderDataGrid, buildCodeDataGridTarget, true);

    // Copy the files to the dashboards so they can be compressed later together with the dashboards.
    const buildCodeDashboardsTarget = path.join(buildFolder, 'code');
    fsLib.copyAllFiles(bundleTargetFolderDataGrid, buildCodeDashboardsTarget, true);

    logLib.success(`Created ${buildCodeDataGridTarget}`);
}


gulp.task(
    'dashboards/dist-build',
    gulp.series(
        distBuildDashboards,
        distBuildDataGrid,
        buildCSS
    )
);
