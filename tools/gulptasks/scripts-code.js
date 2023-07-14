/*
 * Copyright (C) Highsoft AS
 */

/* *
 *
 *  Imports
 *
 * */

const gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

/**
 * Adds possibility to `npm i ../highcharts/code` to test local.
 *
 * **Note:** At first you have to generate the code folder in the
 * Highcharts repository, use `npx gulp --dts`.
 */
const developerPackageJson = `{
    "private": true,
    "author": "Highsoft AS <support@highcharts.com> (http://www.highcharts.com/about)",
    "bugs": "https://github.com/highcharts/highcharts/issues",
    "description": "Use \`npm i ../highcharts/code\` to test local. Remember to run \`npx gulp scripts\` and \`npx gulp jsdoc-dts\` to generate the code folder.",
    "homepage": "http://www.highcharts.com",
    "license": "https://www.highcharts.com/license",
    "main": "highcharts.src.js",
    "module": "es-modules/masters/highcharts.src.js",
    "name": "highcharts",
    "repository": "https://github.com/highcharts/highcharts.git",
    "types": "highcharts.src.d.ts",
    "version": "11.0.0+local"
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
function scriptsCode() {

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
                        codeTool.processSrcJSFile(
                            fs.readFileSync(filePath).toString()
                        )
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

gulp.task('scripts-code', scriptsCode);
