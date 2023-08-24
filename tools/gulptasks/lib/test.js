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
 * Returns list of products affected by modified files staged for commit.
 *
 * @param {Boolean} logPaths
 *        Logging for testing and debugging.
 *
 * @return {Array<string>}
 *         Array of detected products.
 */
function getProds(logPaths) {
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

    function mark(prod) {
        if (affectedProducts.indexOf(prod) !== -1) {
            affectedProducts.push(prod);
        }
    }

    paths.forEach(path => {
        // Any path part check
        products.forEach(prodName => {
            const regex = new RegExp(prodName, 'iu');
            if (regex.test(path)) {
                mark(prodName);
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
    getProds
};
