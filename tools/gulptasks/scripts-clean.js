/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

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
    const skipBuildClean = process.env.HIGHCHARTS_SKIP_BUILD_CLEAN === 'true';
    const skipCodeClean = process.env.HIGHCHARTS_SKIP_CODE_CLEAN === 'true';

    const pathsToDelete = PATHS_TO_DELETE.filter(path => {
        if (skipBuildClean && path === 'build') {
            return false;
        }

        if (skipCodeClean && path === 'code') {
            return false;
        }

        return true;
    });

    return new Promise((resolve, reject) => {
        try {
            if (skipBuildClean) {
                log.message('Preserving build directory (with-deps sequence).');
            }

            if (skipCodeClean) {
                log.message('Preserving code directory (with-deps sequence).');
            }

            for (const ptd of pathsToDelete) {
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
