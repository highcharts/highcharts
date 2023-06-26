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
 * Gulp task to run the building process of distribution js files for "older"
 * browsers. By default it builds the js distribution files (without DTS) into
 * the ./code/es5 folder.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
async function dashboardsScripts() {

    const argv = require('yargs').argv;
    const buildTool = require('../../build');
    const fs = require('fs');
    const fsLib = require('../lib/fs');
    const logLib = require('../lib/log');
    const processLib = require('../lib/process');

    logLib.message('Generating Dashboards code...');

    try {
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

        // Assemble
        await buildTool
            .getBuildScripts({
                base: 'js/masters/',
                debug: (argv.debug || false),
                files: (
                    (argv.file) ?
                        argv.file.split(',') :
                        null
                ),
                output: 'code/dashboards/',
                product: 'Dashboards'
            })
            .fnFirstBuild();

        logLib.success('Created Dashboards code');
    } finally {
        processLib.isRunning('scripts-dashboards', false);
    }
}

gulp.task('dashboards/scripts', gulp.series(
    'scripts-ts',
    'scripts-css',
    'scripts-js',
    'scripts-code',
    dashboardsScripts
));
