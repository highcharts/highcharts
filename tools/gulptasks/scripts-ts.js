/*
 * Copyright (C) Highsoft AS
 */

/* eslint-disable node/no-unsupported-features/node-builtins */

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
            const folder = path.relative(TARGET_FOLDER, path.dirname(filePath)),
                fileName = path.basename(filePath),
                amdPath = path.posix.join(
                    'highcharts',
                    folder.startsWith('masters') ? folder.substr(8) : folder,
                    fileName.substr(0, fileName.indexOf('.'))
                );

            let file = fileBuffer.toString();

            file = file.replace(/( define\()(\[)/, `$1"${amdPath}", $2`);

            logLib.warn('Write', filePath);
            return fs.writeFile(filePath, file);
        });
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
