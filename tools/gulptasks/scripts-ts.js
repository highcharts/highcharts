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

    const errorMessages = require('../error-messages.js'),
        processLib = require('./lib/process');

    return new Promise((resolve, reject) => {

        processLib.isRunning('scripts-ts', true);

        Promise
            .resolve()
            .then(() => errorMessages())
            .then(() => processLib.exec('npx tsc --project ts'))
            .then(function (output) {
                processLib.isRunning('scripts-ts', false);
                resolve(output);
            })
            .catch(function (error) {
                processLib.isRunning('scripts-ts', false);
                reject(error);
            });
    });
}

gulp.task('scripts-ts', task);
