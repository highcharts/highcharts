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
async function dashboardsScriptsESX() {

    const logLib = require('../lib/log');
    const processLib = require('../lib/process');
    const scriptsESX = require('../scripts-esx');
    const tasksConfig = require('./_tasksConfig.json');

    try {
        processLib.isRunning('dashboards-scripts', true);
        await scriptsESX(tasksConfig);
    } catch (error) {
        logLib.error(error);
        throw error;
    } finally {
        processLib.isRunning('dashboards-scripts', false);
    }
}

gulp.task('dashboards/scripts-esx', gulp.series('scripts', dashboardsScriptsESX));
