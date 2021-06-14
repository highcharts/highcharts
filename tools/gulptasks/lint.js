/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Tasks
 *
 * */

require('./lint-ts');
require('./update');

gulp.task('lint', gulp.series(
    process.env.CI ?
        ['lint-ts'] :
        ['update', 'lint-ts']
));
