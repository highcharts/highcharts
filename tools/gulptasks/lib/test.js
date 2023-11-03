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
 * @param {boolean} logPaths
 *        Logging for testing and debugging.
 *
 * @return {Array<string>}
 *         Array of detected products.
 */
function getProducts(logPaths) {
    const ChildProcess = require('node:child_process');

    const paths = Array.from(new Set([
            ...ChildProcess
                .execSync('git diff --cached --name-only --diff-filter=ACM')
                .toString()
                .split('\n')
                .filter(match => !!match),
            ...ChildProcess
                .execSync('git diff HEAD^ HEAD --name-only --diff-filter=ACM')
                .toString()
                .split('\n')
                .filter(match => !!match)
        ])),
        products = [
            'Core',
            'Dashboards',
            'Gantt',
            'Maps',
            'Stock'
        ],
        affectedProducts = new Set();

    // Logging for testing and debugging
    if (logPaths) {
        const log = require('./log');
        log.message('paths: ', paths);
    }

    paths.forEach(path => {
        // Any path part check
        products.forEach(productName => {
            const productNameRegex = new RegExp(productName, 'iu');
            if (productNameRegex.test(path)) {
                affectedProducts.add(productName);
            }
        });

        // By directory detection
        const pathParts = path.split('/');

        if (pathParts.length > 2 && pathParts[0] === 'ts') {
            if (['Accessibility', 'Series', 'Shared', 'Data'].indexOf(pathParts[1]) !== -1) {
                affectedProducts.add('Core');
                affectedProducts.add('Dashboards');
            } else if (pathParts[1] === 'DataGrid') {
                affectedProducts.add('Dashboards');
            }
        }
    });

    return Array.from(affectedProducts);
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

/* *
 *
 *  Exports
 *
 * */

module.exports = {
    getProducts,
    shouldRun,
    saveRun
};
