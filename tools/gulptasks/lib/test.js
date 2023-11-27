/*
 * Copyright (C) Highsoft AS
 */

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
        const log = require('./log');
        log.message('paths: ', paths);
    }

    function mark(product) {
        if (!affectedProducts.includes(product)) {
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
 * Checks if tests should run
 * @param {{ configFile: string, codeDirectory: string, jsDirectory: string, testsDirectory: string }}} config
 * Configuration
 *
 * @return {Promise<boolean>}
 * True if outdated
 */
async function shouldRun({
    configFile,
    codeDirectory,
    jsDirectory,
    testsDirectory
}) {

    const fs = require('fs');
    const fsLib = require('./fs');
    const logLib = require('./log');
    const stringLib = require('./string');

    let configuration = {
        latestCodeHash: '',
        latestJsHash: '',
        latestTestsHash: ''
    };

    if (fs.existsSync(configFile)) {
        configuration = JSON.parse(
            fs.readFileSync(configFile).toString()
        );
    }

    const latestCodeHash = fsLib.getDirectoryHash(
        codeDirectory, true, stringLib.removeComments
    );
    const latestJsHash = fsLib.getDirectoryHash(
        jsDirectory, true, stringLib.removeComments
    );
    const latestTestsHash = fsLib.getDirectoryHash(
        testsDirectory, true, stringLib.removeComments
    );

    if (latestCodeHash === configuration.latestCodeHash &&
        latestJsHash !== configuration.latestJsHash
    ) {

        throw new Error('Code out of sync');
    }

    if (latestCodeHash === configuration.latestCodeHash &&
        latestTestsHash === configuration.latestTestsHash
    ) {

        logLib.success(
            '✓ Source code and unit tests not have been modified' +
            ' since the last successful test run.'
        );

        return false;
    }

    return true;
}

/**
 * Saves test run information
 * @param {{ configFile: string, codeDirectory: string, jsDirectory: string, testsDirectory: string }} config
 * Configuration
 *
 * @return {void}
 */
function saveRun({
    configFile,
    codeDirectory,
    jsDirectory,
    testsDirectory
}) {

    const FS = require('fs');
    const FSLib = require('./fs');
    const StringLib = require('./string');

    const latestCodeHash = FSLib.getDirectoryHash(
        codeDirectory, true, StringLib.removeComments
    );
    const latestJsHash = FSLib.getDirectoryHash(
        jsDirectory, true, StringLib.removeComments
    );
    const latestTestsHash = FSLib.getDirectoryHash(
        testsDirectory, true, StringLib.removeComments
    );

    const configuration = {
        latestCodeHash,
        latestJsHash,
        latestTestsHash
    };

    FS.writeFileSync(configFile, JSON.stringify(configuration));
}

const TEST_PRODUCTS_CONFIG_FILE = 'test-products.tmp.json';

function handleProductArgs() {
    const process = require('node:process');
    const yargs = require('yargs/yargs');
    const { argv } = yargs(process.argv);
    const log = require('./log');

    if (process.env.DEBUG) {
        log.message(argv);
    }

    if (argv.product) {
        return argv.product.split(',');
    }

    if (argv.modifiedProduct) {
        return getProducts(true);
    }

    return false;
}

function setProductsConfig() {
    const fs = require('node:fs');
    const products = handleProductArgs();

    fs.writeFileSync(
        TEST_PRODUCTS_CONFIG_FILE,
        JSON.stringify({
            products
        })
    );

    return products;
}

function resetProductsConfig() {
    const fs = require('node:fs');
    fs.rmSync(TEST_PRODUCTS_CONFIG_FILE, {
        force: true
    });
}

function getProductsConfig() {
    const fs = require('node:fs');
    try {
        return JSON.parse(fs.readFileSync(TEST_PRODUCTS_CONFIG_FILE));
    } catch {
        // try to get fresh products if not stored
        return {
            products: setProductsConfig()
        };
    }
}

/* *
 *
 *  Exports
 *
 * */

module.exports = {
    checkProduct,
    getProducts,
    shouldRun,
    saveRun,
    getProductsConfig,
    setProductsConfig,
    resetProductsConfig
};
