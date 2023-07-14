/*
 * Copyright (C) Highsoft AS
 */


const gulp = require('gulp');
const path = require('path');


/* *
 *
 *  Tasks
 *
 * */


/**
 * Copies additional DTS files, that were not created by TypeScript itself.
 *
 * @return {Promise<void>}
 * Promise to keep.
 */
async function productsJS() {

    const fs = require('fs');
    const logLib = require('../lib/log');

    const {
        release
    } = require('yargs').argv;

    if (!/^\d+\.\d+\.\d+(?:-\w+)?$/su.test(release)) {
        throw new Error('No valid `--release x.x.x` provided.');
    }

    const {
        buildFolder
    } = require('./_config.json');

    const dashboardsProduct = {
        date: '',
        nr: release
    };

    const highchartsProperties = require('../../../build-properties.json');
    const highchartsDate = (highchartsProperties.date || '');
    const highchartsVersion = (
        highchartsProperties.version ||
        require('../../../package.json').version ||
        ''
    ).split('-')[0];
    const highchartsProduct = {
        date: highchartsDate,
        nr: highchartsVersion
    };

    await fs.promises.writeFile(
        path.join(buildFolder, '..', 'products.js'),
        (
            'var products = ' + JSON.stringify({
                Highcharts: highchartsProduct,
                'Highcharts Stock': highchartsProduct,
                'Highcharts Maps': highchartsProduct,
                'Highcharts Gantt': highchartsProduct,
                'Highcharts Dashboards': dashboardsProduct
            }, void 0, '    ') + '\n'
        )
    );

    logLib.success('Created products.js');

}


gulp.task('dashboards/dist-productsjs', productsJS);
