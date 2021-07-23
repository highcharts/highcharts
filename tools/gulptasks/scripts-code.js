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
 * @return {Promise<void>}
 * Promise to keep
 */
function scriptsCode() {

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
                        processVariables(fs.readFileSync(filePath).toString())
                    );
                });

            logLib.success('Processed code sources');

            resolve();

        } catch (error) {

            logLib.failure('ERROR:', error);

            reject(error);

        }
    });
}

gulp.task('scripts-code', scriptsCode);
