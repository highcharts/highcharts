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

gulp.task('dashboards/lint', gulp.series(
    () => lintTS({ datagrid: true }),
    () => lintTS({ dashboards: true }),
    () => lintDTS({ dashboards: true })
));
