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
    "version": "10.0.0+local"
}\n`;

/* *
 *
 *  Functions
 *
 * */

/**
 * Split multiple variables on the same line into several lines.
 *
 * @param {string} content
 * Code content to process.
 *
 * @return {string}
 * Process code content.
 */
function processVariables(content) {
    return content.replace(
        /(^|\n)([ \t]+)(var[ \t]+)([\s\S]+?)(;(?:\n|$))/gm,
        function (match, prefix, indent, statement, variables, suffix) {
            return (
                prefix + indent + statement +
                variables.split(/\n/g).map(function (line) {

                    if (
                        variables.match(/\/\*\* @class \*\//g) ||
                        variables.match(/(['"])[^\1\n]*,[^\1\n]*\1/g)
                    ) {
                        // skip lines with complex strings
                        return line;
                    }

                    const commentPosition = line.indexOf('//');

                    let comment = '';

                    if (commentPosition !== -1) {
                        comment = line.substr(commentPosition);
                        line = line.substr(0, commentPosition);
                    }

                    return (
                        line.replace(
                            /,[ \t]*?([A-z])/g,
                            ',\n    ' + indent + '$1'
                        ) +
                        comment
                    );

                }).join('\n    ') +
                suffix
            );
        }
    );
}

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
                            processVariables(
                                fs.readFileSync(filePath).toString()
                            )
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
