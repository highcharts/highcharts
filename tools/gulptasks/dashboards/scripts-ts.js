/*
 * Copyright (C) Highsoft AS
 */

/* eslint-disable no-use-before-define, node/no-unsupported-features/node-builtins */

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
 * @return {Promise}
 * Promise to keep.
 */
async function scriptsTS() {
    const fsLib = require('../lib/fs');
    const processLib = require('../lib/process');

    try {
        processLib.isRunning('dashboards/scripts-ts', true);

        // Remove Dashboards
        fsLib.deleteDirectory('js/Dashboards/', true);
        fsLib.deleteDirectory('js/DataGrid/', true);
        fsLib.deleteDirectory('js/masters-dashboards', true);

        fsLib.copyAllFiles(
            'ts', 'js', true,
            sourcePath => sourcePath.endsWith('.d.ts')
        );

        await processLib.exec('npx tsc --build ts/masters-dashboards');

        processLib.isRunning('dashboards/scripts-ts', false);
    } finally {
        processLib.isRunning('dashboards/scripts-ts', false);
    }
}

gulp.task('dashboards/scripts-ts', gulp.series('scripts-messages', scriptsTS));
