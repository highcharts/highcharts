/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

/* *
 *
 *  Tasks
 *
 * */

require('./common-browserify');
require('./common-webpack');
require('./scripts');

Gulp.task(
    'common',
    Gulp.series('scripts', 'common-browserify', 'common-webpack')
);
