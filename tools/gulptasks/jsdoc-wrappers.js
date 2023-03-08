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
 * Creates task for specified wrapper to download into `build/api` folder.
 *
 * @param {string} wrapper
 * The wrapper documentation to download.
 *
 * @return {Promise}
 * Promise to keep.
 */
function getDownloadTask(wrapper) {
    const process = require('./lib/process');

    switch (wrapper.toLowerCase()) {
        case 'android':
            return process.exec(
                'git clone --depth 1 https://github.com/highcharts/highcharts-android-dev.git && ' +
                'rm -rf build/api/android && ' +
                'mkdir -p build/api/android && ' +
                'mv highcharts-android-dev/JavaDoc build/api/android/highcharts && ' +
                'rm -rf highcharts-android-dev'
            );
        case 'ios':
            return process.exec(
                'git clone --depth 1 https://github.com/highcharts/highcharts-ios-dev.git && ' +
                'rm -rf build/api/ios && ' +
                'mkdir -p build/api/ios && ' +
                'mv highcharts-ios-dev/api build/api/ios/highcharts && ' +
                'rm -rf highcharts-ios-dev'
            );
        default:
            return Promise.reject(new Error(`Wrapper ${wrapper} not found.`));
    }
}

/**
 * Downloads the documentation for wrappers into the `build/api` folder.
 *
 * @return {Promise<void>}
 * Promise to keep
 */
function jsdocWrappers() {
    const log = require('./lib/log');
    const process = require('./lib/process');

    const argv = require('yargs').argv;
    const promises = [];
    const wrappers = (argv.wrappers || 'android,ios').split(',');

    if (argv.helpme) {
        // eslint-disable-next-line no-console
        console.log([
            '--helpme   This help message',
            '--wrappers [name] Download only named wrappers (comma separated).'
        ].join('\n'));
        return Promise.resolve();
    }

    for (let i = 0, iEnd = wrappers.length; i < iEnd; ++i) {
        promises.push(getDownloadTask(wrappers[i]));
    }

    return Promise
        .resolve()
        .then(() => process.exec('mkdir -p build/api'))
        .then(() => log.warn('Downloading', 'Wrapper documentation...'))
        .then(() => Promise.all(promises))
        .then(() => log.warn('Done. Upload with gulp task "api-upload".'))
        .catch(e => log.failure(e));
}

gulp.task('jsdoc-wrappers', jsdocWrappers);
