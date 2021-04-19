/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Tasks
 *
 * */

require('./scripts-watch.js');

gulp.task('default', gulp.series('scripts-watch'));
