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
 * Builds files of `/ts` folder into `/js` folder.
 *
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
            .then(() => fsLib.copyAllFiles('ts', 'js', true, (
                function (sourcePath) {
                    return sourcePath.endsWith('.d.ts');
                }
            )))
            .then(() => processLib.exec('npx tsc --build ts'))
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
