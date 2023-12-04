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
    'api-upload',
    'dashboards/api',
    'dashboards/api-docs',
    'dashboards/api-server',
    'dashboards/cypress',
    'dashboards/dist',
    'dashboards/dist-build',
    'dashboards/dist-examples',
    'dashboards/dist-minify',
    'dashboards/dist-productsjs',
    'dashboards/dist-release',
    'dashboards/dist-upload',
    'dashboards/dist-verify',
    'dashboards/dist-zip',
    'dashboards/scripts',
    'dashboards/scripts-css',
    'dashboards/scripts-dts',
    'dashboards/scripts-watch',
    'dashboards/test',
    'dashboards/test-dts',
    'dashboards/test-karma',
    'dashboards/test-lint',
    'default',
    'dist',
    'dist-clean',
    'dist-compress',
    'dist-copy',
    'dist-examples',
    'dist-productsjs',
    'dist-release',
    'dist-testresults',
    'dist-upload-code',
    'dist-upload-mapcollection',
    'dist-upload-errors',
    'dist-upload-samples-resources',
    'dist-upload-studies',
    'dist-upload-more',
    'dist-verify',
    'jsdoc',
    'jsdoc-classes',
    'jsdoc-clean',
    'jsdoc-dts',
    'jsdoc-namespace',
    'jsdoc-options',
    'jsdoc-server',
    'jsdoc-watch',
    'jsdoc-websearch',
    'jsdoc-wrappers',
    'jsdoc-zips',
    'lint',
    'lint-dts',
    'lint-samples',
    'lint-ts',
    'palette',
    'prep-release',
    'scripts',
    'scripts-clean',
    'scripts-code',
    'scripts-compile',
    'scripts-css',
    'scripts-es5',
    'scripts-esx',
    'scripts-js',
    'scripts-messages',
    'scripts-ts',
    'scripts-watch',
    'scripts-webpacks',
    'test',
    'test-tree',
    'test-docs',
    'test-ts',
    'reset-visual-references',
    'tsdoc',
    'tsdoc-debug',
    'tsdoc-watch',
    'update',
    'unsorted/build-modules',
    'unsorted/compare-filesizes',
    'unsorted/filesize',
    'unsorted/get-filesizes',
    'unsorted/nightly',
    'unsorted/update-vendor',
    'unsorted/upload-files',
    'update-pr-testresults',
    'update-pr-testresults-cypress',
    'pr-size-table'
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
    'copy-graphics-to-dist': 'dist-copy',
    'copy-to-dist': 'dist-copy',
    'create-productjs': 'dist-productsjs',
    'examples': 'dist-examples',
    'start-api-server': 'jsdoc-server',
    'styles': 'scripts-css'
}));
