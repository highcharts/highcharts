/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Task
 *
 * */

/**
 * Dist task
 * @return {Promise}
 * Promise to keep.
 */
async function scripts() {

    const fsLib = require('../lib/fs');
    const logLib = require('../lib/log');
    const processLib = require('../lib/process');
    const scriptsESX = require('../scripts-esx');
    const tasksConfig = require('./_tasksConfig.json');

    try {
        processLib.isRunning('dashboards-scripts', true);

        await scriptsESX({
            bundleSourceFolder: tasksConfig.bundleSourceFolder,
            bundleTargetFolder: tasksConfig.bundleTargetFolder,
            esModulesFolder: tasksConfig.esModulesFolder,
            typeScriptFolder: tasksConfig.typeScriptFolder
        });

    } catch (error) {
        logLib.error(error);
        throw error;
    } finally {
        processLib.isRunning('dashboards-scripts', false);
    }
}

gulp.task('dashboards/scripts', scripts);
