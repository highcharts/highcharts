/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Tasks
 *
 * */

require('./lint-js');
require('./update');

gulp.task('lint', gulp.series('update', 'lint-js', 'lint-ts'));
