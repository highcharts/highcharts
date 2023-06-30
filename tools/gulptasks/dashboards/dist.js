/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Tasks
 *
 * */

require('./dist-minify.js');

gulp.task('dashboards/dist', gulp.series(
    'dashboards/scripts',
    'dashboards/dist-minify'
));
