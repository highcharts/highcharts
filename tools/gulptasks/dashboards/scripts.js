/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Tasks
 *
 * */

/**
 * Gulp task to run the building process of distribution js files using webpack.
 *
 * @return {Promise<void>}
 * Promise to keep
 */
async function dashboardsScripts() {
    const argv = require('yargs').argv;
    const fsLib = require('../../libs/fs');
    const logLib = require('../../libs/log');
    const processLib = require('../../libs/process');

    const {
        esModulesFolder
    } = require('./_config.json');

    try {
        logLib.message('Building Dashboards with webpack...');

        // Run scripts-webpack for dashboards
        const ProcessLib = require('../../libs/process');
        await ProcessLib.exec(
            'npx webpack -c tools/webpacks/dashboards.webpack.mjs --no-color',
            { silent: 2 }
        );

        // Copy webpack-generated JS files to es-modules/masters for tests
        // Copy dashboards.src.js
        fsLib.copyFile(
            'code/dashboards/dashboards.src.js',
            esModulesFolder + '/masters/dashboards.src.js'
        );

        // Copy modules JS files if they exist
        if (fsLib.isDirectory('code/dashboards/modules')) {
            fsLib.copyAllFiles(
                'code/dashboards/modules/',
                esModulesFolder + '/masters/modules/',
                true,
                sourcePath => sourcePath.endsWith('.src.js')
            );
        }

        // Copy valid native DTS
        fsLib.copyAllFiles(
            'js/',
            esModulesFolder,
            true,
            sourcePath => sourcePath.endsWith('.d.ts')
        );

        logLib.success('Created Dashboards code');
    } finally {
        processLib.isRunning('scripts-dashboards', false);
    }
}

/**
 * Gulp task to run the building process of distribution js files the classic
 * way.
 *
 * @return {Promise<void>}
 * Promise to keep
 */
async function dataGridScripts() {
    const argv = require('yargs').argv;
    const buildTool = require('../../build');
    const fsLib = require('../../libs/fs');
    const logLib = require('../../libs/log');
    const processLib = require('../../libs/process');

    const {
        bundleTargetFolderDataGrid,
        esModulesFolderDataGrid
    } = require('./_config.json');

    try {
        const { release } = argv;

        // Assemble bundle
        await buildTool
            .getBuildScripts({
                base: 'js/masters/',
                debug: (argv.debug || false),
                files: (
                    (argv.file) ?
                        argv.file.split(',') :
                        null
                ),
                namespace: 'DataGrid',
                product: 'DataGrid',
                output: bundleTargetFolderDataGrid,
                version: (release || ''),
                assetPrefix: release ?
                    `https://code.highcharts.com/datagrid/${release}` :
                    '/code/datagrid'
            })
            .fnFirstBuild();

        // Copy valid native DTS
        fsLib.copyAllFiles(
            'js/',
            esModulesFolderDataGrid,
            true,
            sourcePath => sourcePath.endsWith('.d.ts')
        );

        logLib.success('Created DataGrid code');
    } finally {
        processLib.isRunning('scripts-dashboards', false);
    }
}

/**
 * Copy DataGrid files to the correct location so it matches the structure of
 * code.highcharts.com
 */
async function copyDataGrid() {
    const fsLib = require('../../libs/fs');
    const {
        bundleTargetFolderDataGrid,
        bundleTargetFolder,
        cssFolder
    } = require('./_config.json');

    fsLib.copyAllFiles(
        bundleTargetFolderDataGrid,
        bundleTargetFolder,
        false
    );

    fsLib.copyFile(
        bundleTargetFolderDataGrid + 'css/datagrid.css',
        cssFolder + 'datagrid.css'
    );
}

const { scriptsTS } = require('../scripts-ts');
const { scriptCSS } = require('../scripts-css');
require('./scripts-dts');

gulp.task('dashboards/scripts', gulp.series(
    () => scriptsTS({ dashboards: true }),
    dashboardsScripts,
    () => scriptCSS({ dashboards: true }),
    'dashboards/scripts-dts'
));
