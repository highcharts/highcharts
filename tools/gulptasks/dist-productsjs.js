/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');
const Path = require('path');

/* *
 *
 *  Constants
 *
 * */

const TARGET_FILE = Path.join('build', 'dist', 'products.js');

/* *
 *
 *  Tasks
 *
 * */

/**
 * Creates a products.js file with version numbers for each product.
 * @return {Promise<void>}
 *         Promise to keep
 */
async function distProductsJS() {

    const fs = require('fs');
    const LogLib = require('./lib/log');

    LogLib.message('Generating', TARGET_FILE + '...');

    const buildProperties = require('../../build-properties.json');
    const packageJson = require('../../package.json');

    const date = (
        buildProperties.date ||
        ''
    );

    const nr = (
        buildProperties.version ||
        packageJson.version ||
        ''
    ).split('-')[0];

    const dashboardsProduct = {
        date,
        nr: '1.0.0'
    };

    if (fs.existsSync('../dashboards-dist')) {
        dashboardsProduct.nr = (
            require('../../../dashboards-dist/package.json').version ||
            dashboardsProduct.nr
        );
    }

    await fs.promises.writeFile(
        TARGET_FILE,
        (
            'var products = ' + JSON.stringify({
                Highcharts: { date, nr },
                'Highcharts Stock': { date, nr },
                'Highcharts Maps': { date, nr },
                'Highcharts Gantt': { date, nr },
                'Highcharts Dashboards': dashboardsProduct
            }, void 0, '    ') + '\n'
        )
    );

    LogLib.success('Created', TARGET_FILE);
}

Gulp.task('dist-productsjs', distProductsJS);
