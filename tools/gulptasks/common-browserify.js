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
    'samples', 'highcharts', 'common-js', 'browserify', 'demo.js'
);

/* *
 *
 *  Tasks
 *
 * */

/**
 * @return {Promise<void>}
 *         Promise to keep
 */
function commonBrowserify() {

    const browserify = require('browserify');
    const FS = require('fs');
    const LogLib = require('./lib/log');

    return new Promise((resolve, reject) => {

        LogLib.message('Browserify...');

        browserify(SOURCE_FILE)
            .bundle(function (error, buffer) {
                if (error) {
                    reject(error);
                } else {
                    FS.writeFileSync(TARGET_FILE, buffer);
                    LogLib.success('Browserify done');
                    resolve();
                }
            });
    });
}

Gulp.task('common-browserify', commonBrowserify);
