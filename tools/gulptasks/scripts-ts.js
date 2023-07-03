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
    const fsLib = require('./lib/fs'),
        processLib = require('./lib/process');

    try {
        processLib.isRunning('scripts-ts', true);

        fsLib.deleteDirectory('js/', true);

        fsLib.copyAllFiles(
            'ts', 'js', true,
            sourcePath => sourcePath.endsWith('.d.ts')
        );

        await processLib.exec('npx tsc --build ts');

        // Remove Dashboards
        fsLib.deleteDirectory('js/Dashboards/', true);
        fsLib.deleteDirectory('js/DataGrid/', true);

        processLib.isRunning('scripts-ts', false);
    } finally {
        processLib.isRunning('scripts-ts', false);
    }
}

gulp.task('scripts-ts', gulp.series('scripts-messages', scriptsTS));
