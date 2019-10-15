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
 * Creates keyword URL sets for the API search
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function jsDocSearch() {

    const libLog = require('./lib/log');
    const libProcess = require('./lib/process');

    return Promise
        .resolve()
        .then(() => libLog.message('Creating search keywords...'))
        .then(() => libProcess.exec('cd build/api && npx highsoft-search --depth 3 --out ./search/ --sideload ./class-reference/ https://api.highcharts.com/class-reference/'))
        .then(() => libProcess.exec('cd build/api && npx highsoft-search --depth 3 --out ./search/ --sideload ./gantt/ https://api.highcharts.com/gantt/'))
        .then(() => libProcess.exec('cd build/api && npx highsoft-search --depth 3 --out ./search/ --sideload ./highcharts/ https://api.highcharts.com/highcharts/'))
        .then(() => libProcess.exec('cd build/api && npx highsoft-search --depth 3 --out ./search/ --sideload ./highmaps/ https://api.highcharts.com/highmaps/'))
        .then(() => libProcess.exec('cd build/api && npx highsoft-search --depth 3 --out ./search/ --sideload ./highstock/ https://api.highcharts.com/highstock/'))
        .then(() => libLog.success('Done.'));
}

gulp.task('jsdoc-search', jsDocSearch);
