/*
 * Copyright (C) Highsoft AS
 */

/* eslint quote-props: 0 */

'use strict';

const Gulp = require('gulp');
const GulpForwardReference = require('undertaker-forward-reference');

Gulp.registry(new GulpForwardReference());

/* *
 *
 *  Gulp Tasks
 *
 * */

(function (tasks) {
    tasks.forEach(
        gulpTask => require('./tools/gulptasks/' + gulpTask)
    );
}([
    'common',
    'common-browserify',
    'common-webpack',
    'dist',
    'dist-ant',
    'dist-upload',
    'dist-testresults',
    'dist-clean',
    'dist-compress',
    'dist-copy',
    'dist-examples',
    'dist-productsjs',
    'jsdoc',
    'jsdoc-classes',
    'jsdoc-clean',
    'jsdoc-dts',
    'jsdoc-namespace',
    'jsdoc-options',
    'jsdoc-server',
    'jsdoc-watch',
    'lint',
    'lint-dts',
    'lint-js',
    'lint-samples',
    'lint-ts',
    'scripts',
    'scripts-clean',
    'scripts-compile',
    'scripts-css',
    'scripts-js',
    'scripts-ts',
    'scripts-vendor',
    'scripts-watch',
    'test',
    'tsdoc',
    'tsdoc-watch',
    'update',
    'unsorted/build-modules',
    'unsorted/compare-filesize',
    'unsorted/default',
    'unsorted/filesize',
    'unsorted/get-filesizes',
    'unsorted/nightly',
    'unsorted/update-vendor',
    'unsorted/upload-api',
    'unsorted/upload-files'
]));

/* *
 *
 *  Gulp Task Aliases
 *
 * */

(function (tasks) {
    Object
        .keys(tasks)
        .forEach(alias => Gulp.task(alias, Gulp.series(tasks[alias])));
}({
    'clean-api': 'jsdoc-clean',
    'clean-code': 'series-clean',
    'clean-dist': 'dist-clean',
    'compile': 'scripts-compile',
    'compile-lib': 'scripts-vendor',
    'copy-graphics-to-dist': 'dist-copy',
    'copy-to-dist': 'dist-copy',
    'create-productjs': 'dist-productsjs',
    'examples': 'dist-examples',
    'start-api-server': 'jsdoc-server',
    'styles': 'scripts-css'
}));
