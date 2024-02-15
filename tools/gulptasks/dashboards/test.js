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
const { testKarma } = require('../test-karma');

gulp.task('dashboards/test', gulp.series(
    'dashboards/scripts',
    () => lintTS({ datagrid: true }),
    () => lintTS({ dashboards: true }),
    () => testKarma({ dashboards: true }),
    () => lintDTS({ dashboards: true })
));
