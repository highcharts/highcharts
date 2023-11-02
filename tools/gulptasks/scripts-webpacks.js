/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const path = require('path');

/* *
 *
 *  Constants
 *
 * */

const WEBPACKS_PATH = path.join('tools', 'webpacks');

/* *
 *
 *  Tasks
 *
 * */

/**
 * Webpack task
 *
 * @return {Promise<void>}
 * Promise to keep
 */
function scriptsWebpacks() {

    const fsLib = require('./lib/fs');
    const logLib = require('./lib/log');
    const processLib = require('./lib/process');
    const verbose = process.argv.includes('--verbose');
    const webpack = require('webpack');

    return new Promise((resolve, reject) => {

        try {
            webpack(
                fsLib
                    .getFilePaths(WEBPACKS_PATH, true)
                    .filter(filePath => filePath.endsWith('.webpack.js'))
                    .map(filePath => require(path.join(processLib.CWD, filePath))),
                (error, status) => {

                    logLib.message(status.toString({
                        chunks: verbose,
                        colors: true
                    }));

                    if (error || status.hasErrors()) {
                        logLib.failure('ERROR:', error);
                        reject(error);
                    } else {
                        logLib.success('Processed code sources');
                        resolve();
                    }
                }
            );

        } catch (error) {

            logLib.failure('ERROR:', error);

            reject(error);

        }
    });
}

gulp.task('scripts-webpacks', scriptsWebpacks);
