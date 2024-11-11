/*
 * Copyright (C) Highsoft AS
 */


const Gulp = require('gulp');


/* *
 *
 *  Constants
 *
 * */


const FOLDERS_TO_DELETE = [
    'build',
    'code',
    'js',
    'out',
    'tmp',
    'vendor'
];


/* *
 *
 *  Tasks
 *
 * */


/**
 * Clean task to reset local repository during NPM's installation of
 * dependencies.
 *
 * @return {Promise<void>}
 * Promise to keep
 */
async function clean() {
    const FSLib = require('../libs/fs');
    const LogLib = require('../libs/log');

    LogLib.warn('Deleting local folders...');

    for (const folderToDelete of FOLDERS_TO_DELETE) {
        LogLib.message('./' + folderToDelete);
        FSLib.deleteDirectory(folderToDelete, true);
    }

}


Gulp.task('clean', clean);
