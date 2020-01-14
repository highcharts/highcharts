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
 * Downloads the documentation for wrappers into the `./api` folder.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function jsDocWrappers() {

    const logLib = require('./lib/log');
    const processLib = require('./lib/process');

    return Promise
        .resolve()
        .then(() => processLib.exec('mkdir -p build/api'))
        .then(() => logLib.warn('Downloading', 'Android wrapper documentation...'))
        .then(() => processLib.exec(
            'git clone --depth 1 https://github.com/highcharts/highcharts-android-dev.git && ' +
            'mv highcharts-android-dev/JavaDoc build/api/android && ' +
            'rm -rf highcharts-android-dev'
        ))
        .then(() => logLib.warn('Downloading', 'iOS wrapper documentation...'))
        .then(() => processLib.exec(
            'git clone --depth 1 https://github.com/highcharts/highcharts-ios-dev.git && ' +
            'mv highcharts-ios-dev/api build/api/ios && ' +
            'rm -rf highcharts-ios-dev'
        ))
        .then(() => logLib.warn('Done. Upload with gulp task "upload-wrapper-apidocs".'));
}

require('./jsdoc.js');

gulp.task('jsdoc-wrappers', jsDocWrappers);
