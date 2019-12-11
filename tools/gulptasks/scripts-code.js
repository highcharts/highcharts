/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Tasks
 *
 * */

/**
 * @return {Promise<void>}
 *         Promise to keep
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
                        codeTool.processSources(fs.readFileSync(filePath))
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

gulp.task('scripts-code', task);
