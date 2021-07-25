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

const DEFINE_PATTERN = /(define\()(\["require", "exports")((?:, "[\/\.\w]+")*)(\], factory\);)/;

const FACTORY_HEADER = /(\}\)\(function \()(require, exports)(\) \{)/;

const REQUIRE_PATTERN = /(require\(")([\/\.\w]+)("\))/g;

const SOURCE_FOLDER = 'ts';

const TARGET_FOLDER = path.join('build', 'v2');

/* *
 *
 *  Functions
 *
 * */

/**
 * @param {string} filePath
 * Path to file
 *
 * @return {Promise}
 * Promise to keep.
 */
function assemble(filePath) {
    const fs = require('fs').promises,
        logLib = require('./lib/log');

    return fs
        .readFile(filePath)
        .then(fileBuffer => {
            const amdPath = getAMDPath(filePath),
                fileFolder = path.dirname(filePath),
                isMaster = filePath.endsWith('.src.js');

            let file = fileBuffer.toString();

            file = file
                .replace(DEFINE_PATTERN, (
                    _match,
                    defineOpen,
                    moduleDefaults,
                    modulePaths,
                    defineClose
                ) => {
                    defineOpen = `${defineOpen}"${amdPath}", `;
                    defineClose = `${defineClose}`;
                    modulePaths = ', "highcharts"';
                    return `${defineOpen}${moduleDefaults}${modulePaths}${defineClose}`;
                })
                .replace(FACTORY_HEADER, (
                    _match,
                    factoryOpen,
                    factoryArguments,
                    factoryClose
                ) => [
                    '    else {',
                    (
                        isMaster ?
                            '        if (window.Highcharts) window.Highcharts.error(16, true);' :
                            ''
                    ),
                    '        var H = window.Highcharts || (window.Highcharts = {}),',
                    '            modules = H._modules || (H._modules = {}),',
                    `            module = modules["${amdPath}"] || (modules["${amdPath}"] = {})`,
                    '        if (!module) {',
                    '            factory(function (module) { return modules[module]; }, module, H);',
                    '        }',
                    '    }',
                    ''
                ].join('\n') + [
                    factoryOpen,
                    factoryArguments,
                    ', Highcharts',
                    factoryClose
                ].join(''))
                .replace(REQUIRE_PATTERN, (
                    _match,
                    requireOpen,
                    modulePath,
                    requireClose
                ) => [
                    requireOpen,
                    getAMDPath(path.posix.join(fileFolder, modulePath)),
                    requireClose
                ].join(''));

            logLib.warn('Write', filePath);
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
    const folder = path.relative(TARGET_FOLDER, path.dirname(filePath)),
        fileName = path.basename(filePath),
        isMaster = filePath.endsWith('.src.js');

    if (isMaster) {
        return path.posix.join(
            'highcharts',
            folder.substr(8),
            fileName.substr(0, fileName.indexOf('.'))
        );
    }

    return path.posix.join(folder, fileName);
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
        .then(() => Promise.all(fsLib.getFilePaths(TARGET_FOLDER, true).map(assemble)))
        .then(() => processLib.isRunning('scripts-ts', false))
        .catch(error => {
            processLib.isRunning('scripts-ts', false);
            throw error;
        });
}

gulp.task('scripts-ts', gulp.series('scripts-messages', argv.v2 ? scriptsTSv2 : scriptsTS));
