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
function jsDocWebSearch() {

    const libLog = require('./lib/log');
    const libProcess = require('./lib/process');

    if (process.argv.includes('--skip-websearch')) {
        libLog.warn('Skipping...');
        return Promise.resolve();
    }

    return Promise
        .resolve()
        .then(() => libLog.message('Creating web search...'))
        .then(() => libProcess.exec('cd build/api && npx highsoft-websearch --depth 3 --inspectIds --out ./websearch/ --sideload ./class-reference/ https://api.highcharts.com/class-reference/'))
        .then(() => libProcess.exec('cd build/api && npx highsoft-websearch --depth 3 --out ./websearch/ --sideload ./highcharts/ https://api.highcharts.com/highcharts/'))
        .then(() => libProcess.exec('cd build/api && npx highsoft-websearch --depth 3 --out ./websearch/ --sideload ./highstock/ https://api.highcharts.com/highstock/'))
        .then(() => libProcess.exec('cd build/api && npx highsoft-websearch --depth 3 --out ./websearch/ --sideload ./highmaps/ https://api.highcharts.com/highmaps/'))
        .then(() => libProcess.exec('cd build/api && npx highsoft-websearch --copyClient --depth 3 --out ./websearch/ --sideload ./gantt/ https://api.highcharts.com/gantt/'))
        .then(() => libLog.success('Done.'));
}

gulp.task('jsdoc-websearch', jsDocWebSearch);
