/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

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

    const Fs = require('fs');
    const FsLib = require('./lib/fs');
    const LogLib = require('./lib/log');
    const Path = require('path');

    return new Promise((resolve, reject) => {

        const CODE_DIRECTORY = 'code';

        const filesToKeep = [
            ['.gitignore'], ['.htaccess'], ['css', 'readme.md'],
            ['js', 'modules', 'readme.md'], ['js', 'readme.md'],
            ['modules', 'readme.md'], ['readme.txt']
        ].map(
            path => Path.join(CODE_DIRECTORY, ...path)
        );

        const filesToDelete = FsLib
            .getFilePaths(CODE_DIRECTORY, true)
            .filter(filePath => filesToKeep.indexOf(filePath) === -1);

        try {

            filesToDelete.forEach(filePath => Fs.unlinkSync(filePath));

            LogLib.success('Cleaned ' + CODE_DIRECTORY);

            resolve();
        } catch (catchedError) {
            reject(catchedError);
        }
    });
}

Gulp.task('scripts-clean', task);
