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

const PATHS_TO_DELETE = [
    'build',
    'code',
    'webpack.log'
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

    const fs = require('../libs/fs');
    const log = require('../libs/log');

    return new Promise((resolve, reject) => {
        try {
            for (const ptd of PATHS_TO_DELETE) {
                log.message('Cleaning', ptd, '...');
                if (fs.isDirectory(ptd)) {
                    fs.deleteDirectory(ptd);
                } else {
                    fs.deleteFile(ptd);
                }
            }
            log.success('Cleaned');
            resolve();
        } catch (catchedError) {
            reject(catchedError);
        }
    });
}

gulp.task('scripts-clean', task);
