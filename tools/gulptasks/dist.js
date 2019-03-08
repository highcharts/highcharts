/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

/* *
 *
 *  Tasks
 *
 * */

/**
 * Creates distribution files
 *
 * @param {Function} done
 *        Gulp done callback
 *
 * @return {any}
 *         Return of the task series
 */
function task(done) {

    require('./dist-ant');
    require('./dist-copy');
    require('./dist-examples');
    require('./dist-productjs');
    require('./jsdoc-namespace');

    return Gulp.series(
        'scripts-clean',
        'styles',
        'scripts',
        'lint',
        'compile',
        'dist-clean',
        'dist-copy',
        'dist-examples',
        'dist-productjs',
        'jsdoc-namespace',
        'jsdoc-options',
        'dts',
        'dtsLint',
        'dist-ant'
    )(done);
}

Gulp.task('dist', task);
