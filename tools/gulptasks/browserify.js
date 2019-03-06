/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

Gulp.task(
    'browserify',
    () => new Promise((resolve, reject) => {

        const browserify = require('browserify');
        const Fs = require('fs');

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
    })
);
