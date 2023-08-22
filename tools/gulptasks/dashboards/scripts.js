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
 * Gulp task to run the building process of distribution js files the classic
 * way.
 *
 * @return {Promise<void>}
 * Promise to keep
 */
async function dashboardsScripts() {

    const argv = require('yargs').argv;
    const buildTool = require('../../build');
    const fs = require('fs');
    const fsLib = require('../lib/fs');
    const logLib = require('../lib/log');
    const processLib = require('../lib/process');

    const {
        bundleTargetFolder,
        esModulesFolder,
        typeScriptFolder
    } = require('./_config.json');

    try {
        logLib.message('Generating Dashboards code...');

        processLib.isRunning('scripts-dashboards', true);

        fsLib.deleteDirectory(bundleTargetFolder, true);
        fsLib.deleteDirectory('js/', true);

        // Transpile
        await processLib.exec(`npx tsc -p ${typeScriptFolder}`);

        // Remove Highcharts
        fsLib.deleteDirectory('js/Accessibility/', true);
        fsLib.deleteDirectory('js/Core/Axis/', true);
        fsLib.deleteDirectory('js/Core/Legend/', true);
        fsLib.deleteDirectory('js/Core/Renderer/SVG/', true);
        fsLib.deleteDirectory('js/Core/Series/', true);
        fsLib.deleteDirectory('js/Extensions/', true);
        fsLib.deleteDirectory('js/Gantt/', true);
        fsLib.deleteDirectory('js/Maps/', true);
        fsLib.deleteDirectory('js/Series/', true);
        fsLib.deleteDirectory('js/Stock/', true);

        // Fix masters
        fs.renameSync('js/masters-dashboards/', 'js/masters/');

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
                output: bundleTargetFolder,
                version: (argv.release || '1.0.1')
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

require('../scripts-css');
require('./scripts-dts');

gulp.task('dashboards/scripts', gulp.series(
    'scripts-css',
    dashboardsScripts,
    'dashboards/scripts-dts'
));
