/*
 * Copyright (C) Highsoft AS
 */


const gulp = require('gulp');


/* *
 *
 *  Tasks
 *
 * */


const { lintDTS } = require('../lint-dts');

gulp.task('dashboards/test', gulp.series(
    'dashboards/scripts',
    'dashboards/test-lint',
    'dashboards/test-karma',
    () => lintDTS({ dashboards: true })
));
