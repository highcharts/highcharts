/*
 * Copyright (C) Highsoft AS
 */


const gulp = require('gulp');


/* *
 *
 *  Tasks
 *
 * */

const { testKarma } = require('../test-karma');

gulp.task('dashboards/test', gulp.series(
    'dashboards/scripts',
    'dashboards/lint',
    () => testKarma({ dashboards: true })
));
