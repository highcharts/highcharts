/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');
const Path = require('path');

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
    path => Path.join(TARGET_DIRECTORY, ...path)
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

    const FS = require('fs');
    const FSLib = require('./lib/fs');
    const LogLib = require('./lib/log');

    return new Promise((resolve, reject) => {

        const filesToDelete = FSLib
            .getFilePaths(TARGET_DIRECTORY, true)
            .filter(filePath => FILES_TO_KEEP.indexOf(filePath) === -1);

        try {

            LogLib.message('Cleaning', TARGET_DIRECTORY, '...');

            filesToDelete.forEach(filePath => FS.unlinkSync(filePath));

            LogLib.success('Cleaned', TARGET_DIRECTORY);

            resolve();
        } catch (catchedError) {
            reject(catchedError);
        }
    });
}

Gulp.task('scripts-clean', task);
