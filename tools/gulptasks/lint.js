/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

/* *
 *
 *  Tasks
 *
 * */

require('./lint-js');
require('./update');

Gulp.task('lint', Gulp.series('update', 'lint-js'));
