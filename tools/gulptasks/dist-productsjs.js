/*
 * Copyright (C) Highsoft AS
 */

/* eslint no-undefined: 0 */

const Gulp = require('gulp');
const Path = require('path');

/* *
 *
 *  Constants
 *
 * */

const BUILD_PROPERTIES_DATE_REGEXP = (
    /highcharts\.product\.date\s*=\s*([^\s]*)/m
);

const BUILD_PROPERTIES_VERSION_REGEXP = (
    /highcharts\.product\.version\s*=\s*([^\s]*)/m
);

const TARGET_FILE = Path.join('build', 'dist', 'products.js');

/* *
 *
 *  Tasks
 *
 * */

/**
 * @return {Promise<void>}
 *         Promise to keep
 */
function distProductsJS() {

    const Fs = require('fs');
    const LogLib = require('./lib/log');

    return new Promise(resolve => {

        LogLib.message('Generating', TARGET_FILE + '...');

        const buildProperties = Fs.readFileSync('build.properties');
        const packageJson = JSON.stringify(
            Fs.readFileSync('package.json').toString()
        );

        const buildPropertiesDate = BUILD_PROPERTIES_DATE_REGEXP
            .exec(buildProperties);
        BUILD_PROPERTIES_DATE_REGEXP.lastIndex = 0;

        const date = (
            buildPropertiesDate && buildPropertiesDate[1] ||
            ''
        );

        const buildPropertiesVersion = BUILD_PROPERTIES_VERSION_REGEXP
            .exec(buildProperties);
        BUILD_PROPERTIES_VERSION_REGEXP.lastIndex = 0;

        const nr = (
            buildPropertiesVersion && buildPropertiesVersion[1] ||
            packageJson.version ||
            ''
        );

        Fs.writeFileSync(
            TARGET_FILE,
            (
                'var products = ' + JSON.stringify({
                    Highcharts: { date, nr },
                    Highstock: { date, nr },
                    Highmaps: { date, nr },
                    'Highcharts Gantt': { date, nr }
                }, undefined, '    ') + '\n'
            )
        );

        LogLib.success('Created', TARGET_FILE);

        resolve();
    });
}

Gulp.task('dist-productsjs', distProductsJS);
