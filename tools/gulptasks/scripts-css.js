/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const COPY_DIRECTORIES = [
    'css',
    'gfx'
];

const SOURCE_DIRECTORY = 'css';

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

    const FS = require('fs');
    const FSLib = require('./lib/fs');
    const LogLib = require('./lib/log');
    const mkDirP = require('mkdirp');
    const Path = require('path');
    const SASS = require('node-sass');

    return new Promise(resolve => {

        LogLib.message('Generating css ...');

        COPY_DIRECTORIES.forEach(
            copyPath => FSLib.copyAllFiles(
                copyPath,
                Path.join(TARGET_DIRECTORY, copyPath),
                true,
                sourcePath => !sourcePath.endsWith('.scss')
            )
        );

        let targetPath;

        FSLib
            .getFilePaths(SOURCE_DIRECTORY, true)
            .filter(sourcePath => sourcePath.endsWith('.scss'))
            .forEach(sourcePath => {

                targetPath = Path.join(
                    TARGET_DIRECTORY, sourcePath.replace('.scss', '.css')
                );

                mkDirP.sync(Path.dirname(targetPath));

                FS.writeFileSync(
                    targetPath,
                    SASS.renderSync({
                        file: sourcePath,
                        outputStyle: 'expanded'
                    }).css
                );
            });

        LogLib.success('Created CSS');

        resolve();
    });
}

Gulp.task('scripts-css', task);
