/*
 * Copyright (C) Highsoft AS
 */

/* *
 *
 *  Imports
 *
 * */

const gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const TO_DELETE = [
    'build',
    'code',
    'cypress',
    'js',
    'node_modules',
    'out',
    'package-lock.json',
    'tmp',
    'vendor'
];

/* *
 *
 *  Tasks
 *
 * */

/**
 * Resets the repository clone.
 *
 * @param  {object} argv
 *         Command line arguments
 *
 * @return {Promise}
 *         Promise to keep.
 */
async function resetClone(argv) {
    const fsLib = require('../libs/fs');
    const logLib = require('../libs/log');

    logLib.message('Delete files & folders...');

    for (const item of TO_DELETE) {
        logLib.warn(item);
        if (fsLib.isDirectory(item)) {
            fsLib.deleteDirectory(item, true);
        } else {
            fsLib.deleteFile(item);
        }
    }

    logLib.success('Done.');

}

gulp.task('reset-clone', resetClone);
