/*
 * Copyright (C) Highsoft AS
 */


const gulp = require('gulp');


/* *
 *
 *  Tasks
 *
 * */


require('./api-docs.js');
require('./api-server.js');


gulp.task('dashboards/api', gulp.series(
    'dashboards/api-docs',
    'dashboards/api-server'
));
