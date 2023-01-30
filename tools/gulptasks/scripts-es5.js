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
 * Gulp task to run the building process of distribution js files for "older"
 * browsers. By default it builds the js distribution files (without DTS) into
 * the ./code/es5 folder.
 *
 * @todo add --help command to inform about usage.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function task() {

    const argv = require('yargs').argv;
    const buildTool = require('../build');
    const fsLib = require('./lib/fs');
    const logLib = require('./lib/log');
    const processLib = require('./lib/process');

    return new Promise((resolve, reject) => {

        const BuildScripts = buildTool.getBuildScripts({
            debug: (argv.d || argv.debug || false),
            files: (
                (argv.file) ?
                    argv.file.split(',') :
                    null
            ),
            type: (argv.type || null),
            output: './code/es5'
        });

        logLib.message('Generating ES5 code...');

        processLib.isRunning('scripts-js', true);

        BuildScripts
            // assemble JS files
            .fnFirstBuild()
            .then(() => fsLib.deleteDirectory('./code/es5/es-modules', true))
            .then(() => logLib.success('Created ES5 code'))
            .then(function (output) {
                processLib.isRunning('scripts-js', false);
                resolve(output);
            })
            .catch(function (error) {
                processLib.isRunning('scripts-js', false);
                reject(error);
            });
    });
}

gulp.task('scripts-es5', task);
