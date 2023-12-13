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
 * Gulp task to run the building process of distribution css and gfx files.
 *
 * @return {Promise<void>}
 * Promise to keep
 */
function dashboardsScriptsCSS() {
    const log = require('../lib/log');
    const { copyCSS } = require('../scripts-css');

    const TARGET_DIRECTORY = 'code';

    const dashboardsConfig = {
        sources: [
            'css/dashboards/',
            'gfx/dashboards-icons/'
        ],
        target: TARGET_DIRECTORY + '/dashboards',
        replacePath: 'dashboards/',
        exclude: []
    };

    const datagridConfig = {
        sources: 'css/datagrid/',
        target: TARGET_DIRECTORY + '/datagrid',
        replacePath: 'datagrid/',
        exclude: []
    };

    return new Promise(resolve => {
        log.message('Copy css and gfx ...');

        copyCSS(dashboardsConfig);
        copyCSS(datagridConfig);

        log.success('Done.');

        resolve();
    });

}

gulp.task('dashboards/scripts-css', dashboardsScriptsCSS);
