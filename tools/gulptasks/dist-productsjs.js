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

        function getNr(name) {
            return (
                (name && buildProperties.products[name].version) ||
                buildProperties.version ||
                packageJson.version ||
                ''
            );
        }

        Fs.writeFileSync(
            TARGET_FILE,
            'var products = ' +
                JSON.stringify(
                    {
                        Highcharts: { date, nr: getNr() },
                        'Highcharts Stock': { date, nr: getNr() },
                        'Highcharts Maps': { date, nr: getNr() },
                        'Highcharts Gantt': { date, nr: getNr() },
                        'Highcharts Dashboards': {
                            date,
                            nr: getNr('Highcharts Dashboards')
                        }
                    },
                    undefined,
                    '    '
                ) +
                '\n'
        );

        LogLib.success('Created', TARGET_FILE);

        resolve();
    });
}

Gulp.task('dist-productsjs', distProductsJS);
