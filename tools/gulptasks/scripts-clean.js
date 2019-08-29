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

const TARGET_DIRECTORY = 'code';

const FILES_TO_KEEP = [
    ['.gitignore'],
    ['.htaccess'],
    ['css', 'readme.md'],
    ['js', 'modules', 'readme.md'],
    ['js', 'readme.md'],
    ['modules', 'readme.md'],
    ['readme.txt']
].map(
    filePath => path.join(TARGET_DIRECTORY, ...filePath)
);

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

        const filesToDelete = fs
            .getFilePaths(TARGET_DIRECTORY, true)
            .filter(filePath => !FILES_TO_KEEP.includes(filePath));
        const directoriesToDelete = fs
            .getDirectoryPaths(TARGET_DIRECTORY, true)
            .filter(directoryPath => !FILES_TO_KEEP.some(
                filterPath => filterPath.startsWith(directoryPath)
            ));

        try {

            log.message('Cleaning', TARGET_DIRECTORY, '...');

            filesToDelete.forEach(fs.deleteFile);
            directoriesToDelete.forEach(fs.deleteDirectory);

            log.success('Cleaned', TARGET_DIRECTORY);

            resolve();
        } catch (catchedError) {
            reject(catchedError);
        }
    });
}

gulp.task('scripts-clean', task);
