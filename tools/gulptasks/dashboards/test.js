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
const { lintTS } = require('../lint-ts');

gulp.task('dashboards/test', gulp.series(
    'dashboards/scripts',
    () => lintTS({ dashboards: true }),
    'dashboards/test-karma',
    () => lintDTS({ dashboards: true })
));
