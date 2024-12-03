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

Gulp.task(
    'dist',
    (
        process.argv.includes('--assembler') ?
            // < v12
            Gulp.series(
                'lint-ts',
                'scripts-clean',
                'scripts',
                'scripts-compile',
                'dist-clean',
                'dist-copy',
                'dist-examples',
                'dist-productsjs',
                'jsdoc-dts',
                'lint-dts',
                'dist-compress'
            ) :
            // >= v12
            Gulp.series(
                'lint-ts',
                'scripts-clean',
                'scripts',
                'scripts-compile',
                'dist-clean',
                'dist-copy',
                'dist-examples',
                'dist-productsjs',
                'jsdoc-dts',
                'lint-dts',
                'dist-compress'
            )
    )
);
