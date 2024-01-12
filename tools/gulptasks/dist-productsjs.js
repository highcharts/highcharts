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
const JS_PREFIX = 'var products = ';

/* *
 *
 *  Tasks
 *
 * */

function getZipLocation(productName, version) {
    const zipName = productName.replace(' ', '-');

    if (productName === 'Highcharts Dashboards') {
        const { cdnFolder } = require('./dashboards/_config.json');
        return `https://code.highcharts.com/${cdnFolder.length ? cdnFolder : ''}zips/${zipName}-${version}.zip`;
    }

    return `https://code.highcharts.com/zips/${zipName}-${version}.zip`;
}

function fetchCurrentProducts() {
    return global.fetch('https://code.highcharts.com/products.js')
        .then(response => response.text())
        .then(content => JSON.parse(content.substring(JS_PREFIX.length)));
}

function withZipURL(products) {
    const newProducts = global.structuredClone(products);

    Object.entries(newProducts).forEach(([productName, productObj]) => {
        productObj.zipURL = getZipLocation(productName, productObj.nr);
    });

    return newProducts;
}

async function writeProducts(products) {
    const { writeFile } = require('node:fs/promises');

    await writeFile(
        TARGET_FILE,
        JS_PREFIX + JSON.stringify(products, void 0, '    ') + '\n'
    );

    const jsonProducts = withZipURL(products);

    await writeFile(
        TARGET_FILE.replace('products.js', 'products.json'),
        JSON.stringify(jsonProducts, void 0, '    ') + '\n'
    );
}

/**
 * Creates a products.js file with version numbers for each product.
 * @return {Promise<void>}
 *         Promise to keep
 */
async function distProductsJS() {
    const LogLib = require('./lib/log');

    LogLib.message('Generating', TARGET_FILE + '...');
    const products = await fetchCurrentProducts();

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

    Object.entries(products).forEach(([productName, productObj]) => {
        if (productName !== 'Highcharts Dashboards') {
            productObj.date = date;
            productObj.nr = nr;
        }
    });

    await writeProducts(products);

    LogLib.success('Created', TARGET_FILE);
}

Gulp.task('dist-productsjs', distProductsJS);

module.exports = {
    writeProducts,
    fetchCurrentProducts
};
