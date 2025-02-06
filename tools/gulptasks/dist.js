/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

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

function dist() {
    const argv = require('yargs').argv;
    const product = argv.product || 'Highcharts';

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

    if (product === 'Highcharts') {
        tasks.push('jsdoc-dts');
    }

    tasks.push('lint-dts', 'dist-compress');

    return Gulp.series(tasks);
}

Gulp.task('dist', dist());
