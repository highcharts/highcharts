/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

/* *
 *
 *  Tasks
 *
 * */

/**
 * @return {Promise<undefined>}
 *         Promise to keep
 */
function task() {
    return new Promise((resolve, reject) => {

        const webpack = require('webpack');
        const webpackOptions = {
            // Share the same unit tests
            entry: './samples/highcharts/common-js/browserify/app.js',
            output: {
                filename: './samples/highcharts/common-js/webpack/demo.js'
            }
        };

        webpack(webpackOptions, function (error) {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

Gulp.task('webpack', task);
