/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Tasks
 *
 * */

/**
 * Run remaining dist tasks in `build.xml`.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function distAnt() {

    const processLib = require('./lib/process');

    return new Promise((resolve, reject) => {

        processLib
            .exec('npx ant dist')
            .then(resolve)
            .catch(reject);
    });
}

gulp.task('dist-ant', distAnt);
