/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const path = require('path');

/* *
 *
 *  Constants
 *
 * */

const TARGET_DIRECTORIES = [
    'build',
    'code'
];

/* *
 *
 *  Tasks
 *
 * */

/**
 * Removes all generated files from `code` directory.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function task() {

    const fs = require('./lib/fs');
    const log = require('./lib/log');

    return new Promise((resolve, reject) => {
        try {
            for (const directory of TARGET_DIRECTORIES) {
                log.message('Cleaning', directory, '...');
                fs.deleteDirectory(directory, true);
            }
            log.success('Cleaned');
            resolve();
        } catch (catchedError) {
            reject(catchedError);
        }
    });
}

gulp.task('scripts-clean', task);
