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
 * Gulp task to run the building process of distribution js files the classic
 * way.
 *
 * @return {Promise<void>}
 * Promise to keep
 */
async function dashboardsScripts() {
    const argv = require('yargs').argv;
    const buildTool = require('../../build');
    const fsLib = require('../lib/fs');
    const logLib = require('../lib/log');
    const processLib = require('../lib/process');

    const {
        bundleTargetFolder,
        esModulesFolder
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
                namespace: 'Dashboards',
                product: 'Dashboards',
                output: bundleTargetFolder,
                version: (release || ''),
                assetPrefix: release ?
                    `https://code.highcharts.com/dashboards/${release}` :
                    '/code/dashboards'
            })
            .fnFirstBuild();

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
    const fsLib = require('../lib/fs');
    const logLib = require('../lib/log');
    const processLib = require('../lib/process');

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

const { scriptsTS } = require('../scripts-ts');
const { scriptCSS } = require('../scripts-css');
require('./scripts-dts');

gulp.task('dashboards/scripts', gulp.series(
    () => scriptsTS({ datagrid: true }),
    dataGridScripts,
    () => scriptsTS({ dashboards: true }),
    dashboardsScripts,
    () => scriptCSS({ dashboards: true }),
    'dashboards/scripts-dts'
));
