/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');
const { validateProduct } = require('./utils');

/* *
 *
 *  Tasks
 *
 * */

require('./dist-clean');
require('./dist-copy');
require('./dist-examples');
require('./dist-productsjs');
require('./jsdoc-dts');
require('./lint-dts');
require('./scripts-clean');
require('./scripts-css');
require('./scripts-js');
require('./scripts-webpack');

function dist(callback) {
    const argv = require('yargs').argv;
    const product = argv.product || 'Highcharts';

    if (!validateProduct(product)) {
        throw new Error(`The specified product '${product}' is not valid.`);
    }

    const tasks = [
        'lint-ts',
        'scripts-clean',
        'scripts',
        'scripts-compile',
        'dist-clean',
        'dist-copy',
        'dist-examples',
        'dist-productsjs'
    ];

    switch (product) {
        case 'Highcharts':
            tasks.push('jsdoc-dts');
            break;
        case 'Grid':
            tasks.push('grid/api-docs');
            break;
        default:
    }

    tasks.push('lint-dts', 'dist-compress');

    return Gulp.series(tasks)(callback);
}

dist.description = 'Builds distribution files for the specified product.';
dist.flags = {
    '--product': 'Product name. Available products: Highcharts, Grid. Defaults to Highcharts.'
};
Gulp.task('dist', dist);
