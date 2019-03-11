/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

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

    const Compile = require('../compile');
    const FSLib = require('./lib/fs');
    const LogLib = require('./lib/log');

    return new Promise((resolve, reject) => {

        const argv = process.argv;
        const files = (
            (argv.files) ?
                argv.files.split(',') :
                FSLib
                    .getFilePaths(SOURCE_DIRECTORY, true)
                    .filter(path => (
                        path.endsWith('.src.js') &&
                        !path.includes('es-modules')
                    ))
                    .map(path => path.substr(SOURCE_DIRECTORY.length + 1))
        );

        LogLib.message('Compiling', SOURCE_DIRECTORY + '...');

        Compile
            .compile(files, (SOURCE_DIRECTORY + '/'))
            .then(() => LogLib.success('Compiled', SOURCE_DIRECTORY))
            .then(resolve)
            .catch(reject);
    });
}

Gulp.task('scripts-compile', task);
