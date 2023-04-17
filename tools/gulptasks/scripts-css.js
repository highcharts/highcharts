/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const COPY_DIRECTORIES = [
    'css',
    'gfx'
];

const TARGET_DIRECTORY = 'code';

/* *
 *
 *  Tasks
 *
 * */

/**
 * Creates CSS files
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function task() {

    const fslib = require('./lib/fs');
    const log = require('./lib/log');
    const path = require('path');

    return new Promise(resolve => {

        log.message('Generating css ...');

        COPY_DIRECTORIES.forEach(
            copyPath => fslib.copyAllFiles(
                copyPath,
                path.join(TARGET_DIRECTORY, copyPath),
                true
            )
        );

        log.success('Copied CSS');

        resolve();
    });
}

gulp.task('scripts-css', task);
