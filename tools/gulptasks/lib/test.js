/*
 * Copyright (C) Highsoft AS
 */
/* eslint no-console: 0 */

/* *
 *
 *  Constants
 *
 * */

/* *
 *
 *  Functions
 *
 * */

/**
 * Fails if the product is not affected in the files staged for commit.
 *
 * @throws Will throw an error if the product is not affected.
 *
 * @param {string} product
 *        The product name that should be checked.
 */
function checkProduct(product) {
    const products = getProducts();
    if (products.indexOf(product) === -1) {
        throw new Error(`${product} is not affected`);
    }
}

/**
 * Returns list of products affected by modified files staged for commit.
 *
 * @param {Boolean} logPaths
 *        Logging for testing and debugging.
 *
 * @return {Array<string>}
 *         Array of detected products.
 */
function getProducts(logPaths) {
    const ChildProcess = require('child_process');

    const paths = ChildProcess
            .execSync('git diff --cached --name-only --diff-filter=ACM')
            .toString()
            .split('\n')
            .filter(match => !!match),
        products = [
            'Core',
            'Dashboards',
            'Gantt',
            'Maps',
            'Stock'
        ],
        affectedProducts = [];

    // Logging for testing and debugging
    if (logPaths) {
        console.log('paths: ', paths);
    }

    function mark(product) {
        if (affectedProducts.indexOf(product) !== -1) {
            affectedProducts.push(product);
        }
    }

    paths.forEach(path => {
        // Any path part check
        products.forEach(productName => {
            const productNameRegex = new RegExp(productName, 'iu');
            if (productNameRegex.test(path)) {
                mark(productName);
            }
        });

        // By directory detection
        const pathParts = path.split('/');

        if (pathParts.length > 2 && pathParts[0] === 'ts') {
            if (['Shared', 'Data'].indexOf(pathParts[1]) !== -1) {
                mark('Core');
                mark('Dashboards');
            } else if (pathParts[1] === 'DataGrid') {
                mark('Dashboards');
            }
        }
    });

    return affectedProducts;
}

/* *
 *
 *  Exports
 *
 * */

module.exports = {
    checkProduct,
    getProducts
};
