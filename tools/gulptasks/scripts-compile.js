/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const SOURCE_DIRECTORY = 'code';

/* *
 *
 *  Tasks
 *
 * */

/**
 * Compile the JS files in the /code folder
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function task() {

    const compileTool = require('../compile');
    const fsLib = require('./lib/fs');
    const logLib = require('./lib/log');

    return new Promise((resolve, reject) => {

        const argv = process.argv;
        const files = (
            (argv.files) ?
                argv.files.split(',') :
                fsLib
                    .getFilePaths(SOURCE_DIRECTORY, true)
                    .filter(path => (
                        path.endsWith('.src.js') &&
                        !path.includes('es-modules')
                    ))
                    .map(path => path.substr(SOURCE_DIRECTORY.length + 1))
        );

        logLib.message('Compiling', SOURCE_DIRECTORY + '...');

        compileTool
            .compile(files, (SOURCE_DIRECTORY + '/'))
            .then(() => logLib.success('Compiled', SOURCE_DIRECTORY))
            .then(resolve)
            .catch(reject);
    });
}

gulp.task('scripts-compile', task);
