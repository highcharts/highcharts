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
            'Grid',
            'Gantt',
            'Maps',
            'Stock',
            'Accessibility'
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
        const pathParts = path.split('/');

        // Docs: skip – don't trigger tests when only docs are modified
        if (pathParts[0] === 'docs' && pathParts.length > 1) {
            return;
        }

        // Any path part check (for non-docs paths)
        products.forEach(productName => {
            const productNameRegex = new RegExp(productName, 'iu');
            if (productNameRegex.test(path)) {
                mark(productName);
            }
        });

        // By directory detection
        if (pathParts.length > 2 && pathParts[0] === 'ts') {
            if (['Shared', 'Data'].indexOf(pathParts[1]) !== -1) {
                mark('Core');
                mark('Dashboards');
            } else if (pathParts[1] === 'Grid') {
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
 * @param {{ configFile: string, codeDirectory: string, jsDirectory: string, testsDirectory: string, project?: string }} config
 * Configuration
 *
 * @return {Promise<boolean>}
 * True if outdated
 */
async function shouldRun({
    configFile,
    codeDirectory,
    jsDirectory,
    testsDirectory,
    project
}) {

    const fs = require('fs');
    const fsLib = require('../../libs/fs');
    const logLib = require('../../libs/log');
    const stringLib = require('./string');

    let configuration = {
        latestCodeHash: '',
        latestJsHash: '',
        latestTestsHash: '',
        project: ''
    };

    if (fs.existsSync(configFile)) {
        configuration = JSON.parse(
            fs.readFileSync(configFile).toString()
        );
    }

    // If project parameter is provided and differs from cached project,
    // force rebuild
    if (project && configuration.project !== project) {
        return true;
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
 * @param {{ configFile: string, codeDirectory: string, jsDirectory: string, testsDirectory: string, project?: string }} config
 * Configuration
 *
 * @return {void}
 */
function saveRun({
    configFile,
    codeDirectory,
    jsDirectory,
    testsDirectory,
    project
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
        latestTestsHash,
        project: project || ''
    };

    FS.writeFileSync(configFile, JSON.stringify(configuration));
}

function handleProductArgs() {
    const process = require('node:process');
    const argv = require('yargs').argv;
    const log = require('../../libs/log');

    if (process.env.DEBUG) {
        log.message(argv);
    }

    // Override to run all tests
    // $ TEST_ALL=1 git commit -am "My commit message"
    if (process.env.TEST_ALL) {
        return false;
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

--force
Forces tests without cached results.

--modified
Runs tests for products affected by modified files staged for commit.

--product
Selects a product to test.
Available products are Core, Gantt, Maps, Stock, Dashboards and Grid.

--speak
Says if tests failed or succeeded.

For browser selection, individual test paths and other Playwright options,
use \`npx playwright test\` directly. For example:
npx playwright test tests/highcharts/chart --project=highcharts

For visual tests, use \`npm run test:pw:visual\`.
Set VISUAL_TEST_REFERENCE=1 when generating references.

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
