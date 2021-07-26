/*
 * Copyright (C) Highsoft AS
 */

/* eslint-disable no-use-before-define, node/no-unsupported-features/node-builtins */

/* *
 *
 *  Imports
 *
 * */

const argv = require('yargs').argv,
    gulp = require('gulp'),
    path = require('path');

/* *
 *
 *  Constants
 *
 * */

// const DEFINE_PATTERN = /(define\()(\["require", "exports")((?:, "[\/\.\w]+")*)(\], factory\);)/;

const FACTORY_HEADER = /(\}\)\(function \()(require, exports)(\) \{)/;

const DEFAULT_PATTERN = /(var __importDefault =.*?)(?=\s+\(function \(factory)/;

const PRODUCT_MASTERS = ['highcharts', 'highcharts-gantt', 'highmaps', 'highstock'];

const REQUIRE_PATTERN = /(require\(")([\/\.\w]+)("\))/g;

const SOURCE_FOLDER = 'ts';

const TARGET_FOLDER = path.join('build', 'v2');

/* *
 *
 *  Functions
 *
 * */

/**
 * Creates package of required files.
 *
 * @param {string} filePath
 * Path to file to assemble.
 *
 * @return {Promise}
 * Promise to keep.
 */
function assemblePackage(filePath) {
    const fs = require('fs').promises;

    return fs
        .readFile(filePath)
        .then(
            fileBuffer => Promise.all(
                getRequiredModules(
                    filePath,
                    isProductMaster(filePath)
                ).map(modulePath => fs.readFile(
                    path.join(TARGET_FOLDER, modulePath)
                ))
            ).then(moduleBuffers => fs.writeFile(
                filePath,
                moduleBuffers
                    .map(moduleBuffer => moduleBuffer.toString())
                    .map((module, i) => (
                        i ?
                            module.replace(DEFAULT_PATTERN, '') :
                            module
                    ))
                    .join('') + fileBuffer
            ))
        );
}

/**
 * Adds additional logic for classic namespace to TypeScript UMD.
 *
 * @param {string} filePath
 * Path to file to clean up.
 *
 * @return {Promise}
 * Promise to keep.
 */
function extendUMD(filePath) {
    const fs = require('fs').promises;

    return fs.readFile(filePath).then(fileBuffer => {
        const amdPath = getAMDPath(filePath);

        let file = fileBuffer.toString();

        file = file

            // .replace(DEFINE_PATTERN, (
            //     _match,
            //     defineOpen,
            //     moduleDefaults,
            //     modulePaths,
            //     defineClose
            // ) => {
            //     defineOpen = `${defineOpen}"${amdPath}", `;
            //     defineClose = `${defineClose}`;
            //     modulePaths = ', "highcharts"';
            //     return `${defineOpen}${moduleDefaults}${modulePaths}${defineClose}`;
            // })
            //
            .replace(FACTORY_HEADER, (
                _match,
                factoryOpen,
                factoryArguments,
                factoryClose
            ) => [
                '    else {',
                (
                    isProductMaster(filePath) ?
                        '        if (window.Highcharts) window.Highcharts.error(16, true);' :
                        ''
                ),
                '        var H = window.Highcharts || (window.Highcharts = {}),',
                '            modules = H._modules || (H._modules = {}),',
                `            module = modules["${amdPath}"] || (modules["${amdPath}"] = {})`,
                '        if (!module) {',
                '            factory(function (required) { return modules[required]; }, module, H);',
                '        }',
                '    }',
                ''
            ].join('\n') + [
                factoryOpen,
                factoryArguments,
                // ', Highcharts',
                factoryClose
            ].join(''))

            .replace(REQUIRE_PATTERN, (
                _match,
                requireOpen,
                modulePath,
                requireClose
            ) => [
                requireOpen,
                getAMDPath(path.posix.join(path.dirname(filePath), modulePath)),
                requireClose
            ].join(''));

        return fs.writeFile(filePath, file);
    });
}

/**
 * @param {string} filePath
 * File path to convert.
 *
 * @return {string}
 * AMD path.
 */
function getAMDPath(filePath) {
    const amdFolder = path.relative(TARGET_FOLDER, path.dirname(filePath)),
        fileName = path.basename(filePath);

    return path.posix.join(amdFolder, fileName);
}

/**
 * @param {string} filePath
 * Path to file.
 *
 * @param {string} recursive
 * Whether to include indirect required modules.
 *
 * @return {Array<string>}
 * Ordered array of required modules.
 */
function getRequiredModules(filePath, recursive) {
    const fs = require('fs');

    const file = fs
            .readFileSync(filePath)
            .toString(),
        requiredModules = Array
            .from(file.matchAll(REQUIRE_PATTERN))
            .map(match => match[2]);

    if (recursive) {
        for (let i = 0; i < requiredModules.length; ++i) {
            getRequiredModules(path.join(TARGET_FOLDER, requiredModules[i]), true)
                .forEach(modulePath => {
                    const requiredIndex = requiredModules.indexOf(modulePath);

                    if (requiredIndex === -1) {
                        requiredModules.splice(i++, 0, modulePath);
                    } else if (requiredIndex > i) {
                        requiredModules.splice(
                            i,
                            0,
                            ...requiredModules.splice(requiredIndex, 1)
                        );
                    }
                });
        }
    }

    return requiredModules;
}

/**
 * @param {string} filePath
 * File path to test.
 *
 * @return {boolean}
 * Whether file is product master.
 */
function isProductMaster(filePath) {
    return PRODUCT_MASTERS.includes(path.basename(filePath, '.src.js'));
}

/* *
 *
 *  Tasks
 *
 * */

/**
 * @return {Promise}
 * Promise to keep.
 */
function scriptsTS() {
    const fsLib = require('./lib/fs'),
        processLib = require('./lib/process');

    return Promise
        .resolve(processLib.isRunning('scripts-ts', true))
        .then(() => fsLib.deleteDirectory('code/es-modules', true))
        .then(() => processLib.exec(`npx tsc --project "${SOURCE_FOLDER}"`))
        .then(() => processLib.isRunning('scripts-ts', false))
        .catch(error => {
            processLib.isRunning('scripts-ts', false);
            throw error;
        });
}

/**
 * @return {Promise}
 * Promise to keep.
 */
function scriptsTSv2() {
    const fsLib = require('./lib/fs'),
        processLib = require('./lib/process');

    return Promise
        .resolve(processLib.isRunning('scripts-ts', true))
        .then(() => fsLib.deleteDirectory(TARGET_FOLDER, true))
        .then(() => processLib.exec(`npx tsc --project "${SOURCE_FOLDER}" --module UMD --outDir "${TARGET_FOLDER}"`))
        .then(() => Promise.all(fsLib
            .getFilePaths(TARGET_FOLDER, true)
            .map(extendUMD)))
        .then(() => Promise.all(fsLib
            .getFilePaths(TARGET_FOLDER, true)
            .filter(filePath => filePath.endsWith('highcharts.src.js'))
            .map(assemblePackage)))
        .then(() => processLib.isRunning('scripts-ts', false))
        .catch(error => {
            processLib.isRunning('scripts-ts', false);
            throw error;
        });
}

gulp.task('scripts-ts', gulp.series('scripts-messages', argv.v2 ? scriptsTSv2 : scriptsTS));
