/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const SOURCE_DIRECTORY = 'vendor';

const SOURCE_FILES = [
    'canvg.src.js',
    'rgbcolor.src.js'
];

/* *
 *
 *  Tasks
 *
 * */

/**
 * Compile the JS files in the code directory
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function task() {

    const compile = require('../compile.js');
    const log = require('./lib/log');

    return new Promise((resolve, reject) => {

        log.message('Compiling', SOURCE_DIRECTORY + '...');

        compile
            .compile(SOURCE_FILES, SOURCE_DIRECTORY)
            .then(() => log.success('Compiled', SOURCE_DIRECTORY))
            .then(resolve)
            .catch(reject);
    });
}

gulp.task('scripts-vendor', task);
