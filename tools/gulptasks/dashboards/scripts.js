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
 * @deprecated
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
    const tasksConfig = require('./_config.json');

    try {
        logLib.message('Generating Dashboards code...');

        processLib.isRunning('scripts-dashboards', true);

        fsLib.deleteDirectory('js/', true);

        // Transpile
        await processLib.exec('npx tsc -p ts/masters-dashboards/');

        // Remove Highcharts
        fsLib.deleteDirectory('js/Accessibility/', true);
        fsLib.deleteDirectory('js/Core/Legend/', true);
        fsLib.deleteDirectory('js/Core/Renderer/SVG/', true);
        fsLib.deleteDirectory('js/Extensions/', true);
        fsLib.deleteDirectory('js/Gantt/', true);
        fsLib.deleteDirectory('js/Maps/', true);
        fsLib.deleteDirectory('js/Series/', true);
        fsLib.deleteDirectory('js/Stock/', true);

        // Fix masters
        fs.renameSync('js/masters-dashboards', 'js/masters');

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
                output: tasksConfig.bundleTargetFolder
            })
            .fnFirstBuild();

        logLib.success('Created Dashboards code');
    } finally {
        processLib.isRunning('scripts-dashboards', false);
    }
}

gulp.task('dashboards/scripts', gulp.series('scripts-css', dashboardsScripts));
