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

gulp.task('lint', gulp.series(
    process.env.CI ?
        ['lint-js', 'lint-ts'] :
        ['update', 'lint-js', 'lint-ts']
));
