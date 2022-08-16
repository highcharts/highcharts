/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

/**
 * Adds possibility to `npm i file:../highcharts/code` to test local.
 */
const developerPackageJson = `{
    "private": true,
    "author": "Highsoft AS <support@highcharts.com> (http://www.highcharts.com/about)",
    "bugs": "https://github.com/highcharts/highcharts/issues",
    "homepage": "http://www.highcharts.com",
    "license": "SEE LICENSE IN <../license.txt>",
    "main": "highcharts.src.js",
    "module": "es-modules/masters/highcharts.src.js",
    "name": "highcharts",
    "repository": "https://github.com/highcharts/highcharts.git",
    "types": "highcharts.src.d.ts",
    "version": "10.0.0+local"
}\n`;

/* *
 *
 *  Tasks
 *
 * */

/**
 * Improves transpiled JS files in the code folder.
 *
 * @return {Promise<void>}
 * Promise to keep
 */
function task() {

    const codeTool = require('../code');
    const fs = require('fs');
    const fsLib = require('./lib/fs');
    const logLib = require('./lib/log');
    const verbose = process.argv.includes('--verbose');

    return new Promise((resolve, reject) => {

        try {

            fsLib
                .getFilePaths('code', true)
                .filter(function (filePath) {
                    return (
                        !filePath.includes('/es-modules/') &&
                        filePath.endsWith('.src.js')
                    );
                })
                .forEach(function (filePath) {

                    if (verbose) {
                        logLib.message(filePath);
                    }

                    fs.writeFileSync(
                        filePath,
                        codeTool.processSrcJSFile(fs.readFileSync(filePath))
                    );
                });

            fs.writeFileSync('code/package.json', developerPackageJson);

            logLib.success('Processed code sources');

            resolve();

        } catch (error) {

            logLib.failure('ERROR:', error);

            reject(error);

        }
    });
}

gulp.task('scripts-code', task);
