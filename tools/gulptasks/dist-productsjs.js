/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
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
 *
 * @param  {object} options
 *         Options in case of dashboards.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
async function distProductsJS(options) {
    const fetch = require('node-fetch').default;
    const fs = require('fs');
    const LogLib = require('./lib/log');
    const { dashboards, release } = options;

    LogLib.message(`Creating ${TARGET_FILE} for ${dashboards ? 'dashboards' : 'highcharts'} ...`);

    const prefix = 'var products = ';
    const products = await fetch('https://code.highcharts.com/products.js')
        .then(response => response.text())
        .then(content => JSON.parse(content.substring(prefix.length)));

    if (dashboards) {
        products['Highcharts Dashboards'] = {
            date: new Date().toISOString().split('T')[0],
            nr: release
        };
    } else {
        const buildProperties = require('../../build-properties.json');
        const packageJson = require('../../package.json');
        const date = buildProperties.date || '';
        const nr = (buildProperties.version || packageJson.version || '').split('-')[0];

        products.Highcharts =
        products['Highcharts Stock'] =
        products['Highcharts Maps'] =
        products['Highcharts Gantt'] = (
            { date, nr }
        );
    }

    await fs.promises.writeFile(
        TARGET_FILE,
        prefix + JSON.stringify(products, void 0, '    ') + '\n'
    );

    LogLib.success('Created', TARGET_FILE);
}

gulp.task('dist-productsjs', distProductsJS);

module.exports = {
    distProductsJS
};
