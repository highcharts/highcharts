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
 * @return {Promise<void>}
 *         Promise to keep
 */
function task() {

    const browserify = require('browserify');
    const Fs = require('fs');

    return new Promise((resolve, reject) => {

        browserify('./samples/highcharts/common-js/browserify/app.js')
            .bundle(function (error, buffer) {
                if (error) {
                    reject(error);
                } else {
                    Fs.writeFileSync(
                        './samples/highcharts/common-js/browserify/demo.js',
                        buffer
                    );
                    resolve();
                }
            });
    });
}

Gulp.task('browserify', task);
