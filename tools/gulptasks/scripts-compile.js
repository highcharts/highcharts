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

    const compile = require('../compile');
    const fs = require('./lib/fs');
    const log = require('./lib/log');

    return new Promise((resolve, reject) => {

        const argv = process.argv;
        const files = (
            (argv.files) ?
                argv.files.split(',') :
                fs
                    .getFilePaths(SOURCE_DIRECTORY, true)
                    .filter(path => (
                        path.endsWith('.src.js') &&
                        !path.includes('es-modules')
                    ))
                    .map(path => path.substr(SOURCE_DIRECTORY.length + 1))
        );

        log.message('Compiling', SOURCE_DIRECTORY + '...');

        compile
            .compile(files, (SOURCE_DIRECTORY + '/'))
            .then(() => log.success('Compiled', SOURCE_DIRECTORY))
            .then(resolve)
            .catch(reject);
    });
}

gulp.task('scripts-compile', task);
