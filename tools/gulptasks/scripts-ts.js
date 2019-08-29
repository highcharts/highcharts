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

    const processLib = require('./lib/process');

    return new Promise((resolve, reject) => {

        processLib.isRunning('scripts-ts', true);

        processLib
            .exec('npx tsc --project ts')
            .then(function (output) {
                processLib.isRunning('scripts-ts', true);
                resolve(output);
            })
            .catch(function (error) {
                processLib.isRunning('scripts-ts', true);
                reject(error);
            });
    });
}

gulp.task('scripts-ts', task);
