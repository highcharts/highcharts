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

    require('./dist-ant.js');
    require('./jsdoc-namespace.js');

    return Gulp.series(
        'scripts-clean',
        'styles',
        'scripts',
        'lint',
        'compile',
        'dist-clean',
        'copyToDist',
        'createProductJS',
        'createExamples',
        'copyGraphicsToDist',
        'jsdoc-namespace',
        'jsdoc-options',
        'dts',
        'dtsLint',
        'dist-ant'
    )(done);
}

Gulp.task('dist', task);
