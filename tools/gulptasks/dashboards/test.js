/*
 * Copyright (C) Highsoft AS
 */


const gulp = require('gulp');


/* *
 *
 *  Tasks
 *
 * */


require('./test-dts.js');


gulp.task('dashboards/test', gulp.series(
    'dashboards/scripts',
    'dashboards/test-lint',
    'dashboards/test-karma',
    'dashboards/test-dts'
));
