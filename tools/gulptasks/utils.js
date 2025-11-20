/*
 * Copyright (C) Highsoft AS
 */

const processLib = require('../libs/process');

/* *
 *
 *  Constants
 *
 * */
const PRODUCTS = ['Highcharts', 'Grid', 'Dashboards'];

/**
 * The validation of product name.
 * @param {string} name
 *         Name of product
 * @return {Promise<void>}
 *    Promise to keep
 */
function validateProduct(name) {
    const logLib = require('../libs/log');

    if (PRODUCTS.indexOf(name || 'Highcharts') < 0) {
        logLib.warn('Cannot find a product: ' + name + '.');
        return false;
    }

    return true;
}

/**
 * Build the code for the given products.
 * @param  {string[]} products
 *         The products to build.
 * @return {Promise<void>}
 *         Promise to keep
 */
async function buildCode(products) {
    for (const product of products) {
        if (!validateProduct(product)) {
            continue;
        }

        if (product === 'Highcharts') {
            await processLib.exec('npx gulp scripts');
        } else {
            await processLib.exec(`npx gulp scripts --product ${product}`);
        }
    }
}

/* *
 *
 *  Exports
 *
 * */


module.exports = {
    validateProduct,
    buildCode
};
