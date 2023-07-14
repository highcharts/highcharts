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

const TARGET_FILE = Path.join('build', 'dist', 'products.js');

/* *
 *
 *  Tasks
 *
 * */

/**
 * Creates a products.js file with version numbers for each product.
 * @return {Promise<void>}
 *         Promise to keep
 */
function distProductsJS() {

    const Fs = require('fs');
    const LogLib = require('./lib/log');

    return new Promise(resolve => {

        LogLib.message('Generating', TARGET_FILE + '...');

        const buildProperties = require('../../build-properties.json');
        const packageJson = require('../../package.json');

        const date = (
            buildProperties.date ||
            ''
        );

        const nr = (
            buildProperties.version ||
            packageJson.version ||
            ''
        );

        Fs.writeFileSync(
            TARGET_FILE,
            (
                'var products = ' + JSON.stringify({
                    Highcharts: { date, nr },
                    'Highcharts Stock': { date, nr },
                    'Highcharts Maps': { date, nr },
                    'Highcharts Gantt': { date, nr }
                }, undefined, '    ') + '\n'
            )
        );

        LogLib.success('Created', TARGET_FILE);

        resolve();
    });
}

Gulp.task('dist-productsjs', distProductsJS);
