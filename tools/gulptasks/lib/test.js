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
        const log = require('../../libs/log');
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
    const fsLib = require('../../libs/fs');
    const logLib = require('../../libs/log');
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
    const FSLib = require('../../libs/fs');
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

function handleProductArgs() {
    const process = require('node:process');
    const yargs = require('yargs/yargs');
    const { argv } = yargs(process.argv);
    const log = require('../../libs/log');

    if (process.env.DEBUG) {
        log.message(argv);
    }

    if (argv.product) {
        return argv.product.split(',');
    }

    if (argv.modified) {
        return getProducts(true);
    }

    return false;
}

function getProductTests() {

    const productTestsMap = require('../../../test/karma-product-tests.js');

    const products = handleProductArgs();

    if (Array.isArray(products) && products.length === 0) {
        return false;
    }

    if (!Array.isArray(products)) {
        return void 0;
    }

    const tests = productTestsMap.always;
    const nonProducts = [];

    for (const product of products) {
        if (productTestsMap[product]) {
            tests.push(...productTestsMap[product]);
        } else {
            nonProducts.push(product);
        }
    }

    if (nonProducts.length) {
        const availableProducts = Object.keys(productTestsMap)
            .filter(key => key !== 'always');
        const errorMessage = `Products(s) "${nonProducts.join(', ')}" not found in karma-product-tests.js

Available products are: ${availableProducts.join(', ')}`;

        throw new Error(errorMessage);
    }

    return tests;
}

const HELP_TEXT_COMMON = `

--browsers
Comma separated list of browsers to test. Available browsers are
'ChromeHeadless, Chrome, Firefox, Safari, Edge, IE' depending on what is
installed on the local system. Defaults to ChromeHeadless.

In addition, virtual browsers from Browserstack are supported. They are
prefixed by the operating system. Available BrowserStack browsers are
'Mac.Chrome, Mac.Firefox, Mac.Safari, Win.Chrome, Win.Edge, Win.Firefox,
Win.IE'.

For debugging in Visual Studio Code, use 'ChromeHeadless.Debugging'.

A shorthand option, '--browsers all', runs all BrowserStack machines.

--browsercount
Number of browserinstances to spread/shard the tests across. Default value is 2.
Will default use ChromeHeadless browser. For other browsers specify
argument --splitbrowsers (same usage as above --browsers argument).

--debug
Skips rebuilding and prints some debugging info.

--force
Forces all tests without cached results.

--modified
Runs tests for products affected by modified files staged for commit.

--product
Comma separated list of products to test.
Available products are Core, Gantt, Maps, Stock and Dashboards.

--speak
Says if tests failed or succeeded.

--tests
Comma separated list of tests to run. Defaults to '*.*' that runs all tests
in the 'samples/' directory.
Example: 'gulp test --tests unit-tests/chart/*' runs all tests in the chart
directory.

--testsAbsolutePath
Comma separated list of tests to run. By default runs all tests
in the 'samples/' directory.
Example:
'gulp test --testsAbsolutePath /User/{userName}/{path}/{to}/highcharts/samples/unit-tests/3d/axis/demo.js'
runs all tests in the file.

--ts
Compile TypeScript-based tests.

--dots
Use the less verbose 'dots' reporter

--timeout
Set a different disconnect timeout from default config

`;


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
    handleProductArgs,
    getProductTests,
    HELP_TEXT_COMMON
};
