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
 * @return {Promise<void>}
 *         Promise to keep
 */
function task() {

    const process = require('./lib/process');

    return new Promise((resolve, reject) => {

        process
            .exec('npx tsc --project ts')
            .then(() => resolve())
            .catch(reject);
    });
}

gulp.task('scripts-ts', task);
