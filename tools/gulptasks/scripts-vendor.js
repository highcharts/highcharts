/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

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

    const Compile = require('../compile.js');
    const LogLib = require('./lib/log');

    return new Promise((resolve, reject) => {

        LogLib.message('Compiling', SOURCE_DIRECTORY + '...');

        Compile
            .compile(SOURCE_FILES, SOURCE_DIRECTORY)
            .then(() => LogLib.success('Compiled', SOURCE_DIRECTORY))
            .then(resolve)
            .catch(reject);
    });
}

Gulp.task('scripts-vendor', task);
