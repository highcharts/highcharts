/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const COPY_DIRECTORIES = [
    'css',
    'gfx'
];

const TARGET_DIRECTORY = 'code';

/* *
 *
 *  Tasks
 *
 * */

/**
 * Gulp task to run the building process of distribution css and gfx files.
 *
 * @return {Promise<void>}
 * Promise to keep
 */
function dashboardsScriptsCSS() {

    const fslib = require('../lib/fs');
    const log = require('../lib/log');
    const path = require('path');

    return new Promise(resolve => {
        log.message('Copy css and gfx ...');

        const dashboardsCSS = path.join('css', 'dashboards.css');
        const dashboardsGFX = path.join('gfx', 'dashboards-icons');

        fslib.copyFile(
            dashboardsCSS,
            path.join('code', 'dashboards', dashboardsCSS)
        );

        fslib.copyAllFiles(
            dashboardsGFX,
            path.join('code', 'dashboards', dashboardsGFX),
            true
        );

        const dataGridCSS = path.join('css', 'datagrid.css');

        fslib.copyFile(
            dataGridCSS,
            path.join('code', 'dashboards', dataGridCSS)
        );

        fslib.copyFile(
            dataGridCSS,
            path.join('code', 'datagrid', dataGridCSS)
        );

        log.success('Done.');

        resolve();
    });

}

gulp.task('dashboards/scripts-css', dashboardsScriptsCSS);
