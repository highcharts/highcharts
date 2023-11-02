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

    const fetch = require('node-fetch').default;
    const fs = require('fs');
    const LogLib = require('./lib/log');

    LogLib.message('Generating', TARGET_FILE + '...');

    const prefix = 'var products = ';
    const products = await fetch('https://code.highcharts.com/products.js')
        .then(response => response.text())
        .then(content => JSON.parse(content.substring(prefix.length)));

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

    products.Highcharts =
        products['Highcharts Stock'] =
        products['Highcharts Maps'] =
        products['Highcharts Gantt'] = (
            { date, nr }
        );

    await fs.promises.writeFile(
        TARGET_FILE,
        prefix + JSON.stringify(products, void 0, '    ') + '\n'
    );

    LogLib.success('Created', TARGET_FILE);
}

Gulp.task('dist-productsjs', distProductsJS);
