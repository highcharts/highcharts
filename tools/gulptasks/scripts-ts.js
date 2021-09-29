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
 * @return {Promise}
 * Promise to keep
 */
function scriptsTS() {

    const fsLib = require('./lib/fs'),
        processLib = require('./lib/process');

    return new Promise((resolve, reject) => {

        processLib.isRunning('scripts-ts', true);

        Promise
            .resolve()
            .then(() => fsLib.deleteDirectory('js', true))
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

gulp.task('scripts-ts', gulp.series('scripts-messages', scriptsTS));
