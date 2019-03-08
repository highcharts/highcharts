/*
 * Copyright (C) Highsoft AS
 */

/* eslint no-undefined: 0 */

const Gulp = require('gulp');

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

    const Fs = require('fs');
    const LogLib = require('./lib/log');
    const Path = require('path');

    return new Promise(resolve => {

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
            Path.join('build/dist/product.js'),
            (
                'var product = ' + JSON.stringify({
                    Highcharts: { date, nr },
                    Highstock: { date, nr },
                    Highmaps: { date, nr },
                    Gantt: { date, nr }
                }, undefined, '    ') + ';\n'
            )
        );

        LogLib.success('Created build/dist/product.json');

        resolve();
    });
}

Gulp.task('dist-productjs', task);
