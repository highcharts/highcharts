/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');
const Path = require('path');

/* *
 *
 *  Constants
 *
 * */

const SOURCE_FILE = Path.join(
    'samples', 'highcharts', 'common-js', 'browserify', 'app.js'
);

const TARGET_FILE = Path.join(
    'samples', 'highcharts', 'common-js', 'webpack', 'demo.js'
);

/* *
 *
 *  Tasks
 *
 * */

/**
 * @return {Promise<undefined>}
 *         Promise to keep
 */
function commonWebpack() {

    const LogLib = require('./lib/log');
    const webpack = require('webpack');

    return new Promise((resolve, reject) => {

        const webpackOptions = {
            // Share the same unit tests
            entry: SOURCE_FILE,
            output: {
                filename: TARGET_FILE
            }
        };

        LogLib.message('Webpacking...');

        webpack(webpackOptions, function (error) {
            if (error) {
                reject(error);
            } else {
                LogLib.success('Webpacking done');
                resolve();
            }
        });
    });
}

Gulp.task('common-webpack', commonWebpack);
