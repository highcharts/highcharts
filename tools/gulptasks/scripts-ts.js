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
 * Builds files of `/ts` folder into `/js` folder.
 *
 * @param  {object} argv
 *         Command line arguments
 *
 * @return {Promise}
 *         Promise to keep.
 */
async function scriptsTS(argv) {
    const fs = require('fs');
    const fsLib = require('./lib/fs');
    const logLib = require('./lib/log');
    const processLib = require('./lib/process');
    const {
        bundleTargetFolder,
        typeScriptFolder
    } = require('./dashboards/_config.json');

    try {
        logLib.message(`Generating files for ${argv.dashboards ? 'dashboards' : 'highcharts'}...`);

        processLib.isRunning('scripts-ts', true);

        if (argv.dashboards) {
            fsLib.deleteDirectory(bundleTargetFolder, true);
            fsLib.deleteDirectory(fsLib.path('code/datagrid'), true);
        }

        fsLib.deleteDirectory('js/', true);

        fsLib.copyAllFiles(
            'ts',
            'js',
            true,
            sourcePath => sourcePath.endsWith('.d.ts')
        );

        if (argv.dashboards) {
            await processLib.exec(`npx tsc -p ${typeScriptFolder}`);
        } else {
            await processLib.exec('npx tsc --build ts');
        }

        if (argv.dashboards) {
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
            fsLib.deleteDirectory('js/masters', true);

            // Fix masters
            fs.renameSync('js/masters-dashboards/', 'js/masters/');
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
    '--dashboards': 'Build dashboards files only'
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
