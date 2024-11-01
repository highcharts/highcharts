/*
 * Copyright (C) Highsoft AS
 */

/* *
 *
 *  Imports
 *
 * */

const gulp = require('gulp');

/* *
 *
 *  Tasks
 *
 * */

/**
 * Removes Highcharts files from the `js` folder.
 */
function removeHighcharts() {
    const fsLib = require('../libs/fs');

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
    fsLib.deleteDirectory('js/masters', true);
}

/**
 * Builds files of `/ts` folder into `/js` folder.
 *
 * @param  {object} argv
 *         Command line arguments
 *
 * @return {Promise}
 *         Promise to keep.
 */
async function scriptsTS(argv) {
    const fs = require('node:fs');
    const fsLib = require('../libs/fs');
    const logLib = require('../libs/log');
    const packageJSON = require('../../package.json');
    const processLib = require('../libs/process');
    const {
        bundleTargetFolder,
        typeScriptFolder,
        typeScriptFolderDatagrid
    } = require('./dashboards/_config.json');

    try {
        let library = 'Highcharts';

        if (argv.dashboards) {
            library = 'Dashboards';
        } else if (argv.datagrid) {
            library = 'DataGrid';
        }
        logLib.message(`Generating files for ${library}...`);

        processLib.isRunning('scripts-ts', true);

        if (argv.dashboards) {
            fsLib.deleteDirectory(bundleTargetFolder, true);
            // fsLib.deleteDirectory(fsLib.path('code/datagrid'), true);
        }

        fsLib.deleteDirectory('js/', true);

        fsLib.copyAllFiles(
            'ts',
            argv.assembler ? 'js' : 'code/es-modules/',
            true,
            sourcePath => sourcePath.endsWith('.d.ts')
        );

        if (argv.dashboards) {
            await processLib
                .exec(`npx tsc -p ${typeScriptFolder} --outDir js/`);
        } else if (argv.datagrid) {
            await processLib
                .exec(`npx tsc -p ${typeScriptFolderDatagrid} --outDir js/`);
        } else if (argv.assembler) {
            await processLib
                .exec('npx tsc -p ts --outDir js/');
        } else {
            await processLib
                .exec('npx tsc -p ts');
        }

        if (argv.dashboards) {
            removeHighcharts();

            // Remove DataGrid
            fsLib.deleteDirectory('js/datagrid/', true);
            fsLib.deleteDirectory('js/DataGrid/', true);

            // Fix masters
            fs.renameSync('js/masters-dashboards/', 'js/masters/');
        } else if (argv.datagrid) {
            removeHighcharts();

            // Fix masters
            fs.renameSync('js/masters-datagrid/', 'js/masters/');
        } else {
            // Remove Dashboards
            fsLib.deleteDirectory('js/Dashboards/', true);
            fsLib.deleteDirectory('js/DataGrid/', true);
        }

        processLib.isRunning('scripts-ts', false);
    } finally {
        processLib.isRunning('scripts-ts', false);
    }
}

scriptsTS.description = 'Builds files of `/ts` folder into `/js` folder.';
scriptsTS.flags = {
    '--dashboards': 'Build dashboards files only',
    '--datagrid': 'Build datagrid files only'
};
gulp.task(
    'scripts-ts',
    gulp.series(
        'scripts-messages',
        () => scriptsTS(require('yargs').argv)
    )
);

module.exports = {
    scriptsTS
};
