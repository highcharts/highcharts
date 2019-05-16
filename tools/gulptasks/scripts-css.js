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

    const fs = require('fs');
    const fslib = require('./lib/fs');
    const log = require('./lib/log');
    const mkdir = require('mkdirp');
    const path = require('path');
    const sass = require('node-sass');

    return new Promise(resolve => {

        log.message('Generating css ...');

        COPY_DIRECTORIES.forEach(
            copyPath => fslib.copyAllFiles(
                copyPath,
                path.join(TARGET_DIRECTORY, copyPath),
                true,
                sourcePath => !sourcePath.endsWith('.scss')
            )
        );

        let targetPath;

        fslib
            .getFilePaths(SOURCE_DIRECTORY, true)
            .filter(sourcePath => sourcePath.endsWith('.scss'))
            .forEach(sourcePath => {

                targetPath = path.join(
                    TARGET_DIRECTORY, sourcePath.replace('.scss', '.css')
                );

                mkdir.sync(path.dirname(targetPath));

                fs.writeFileSync(
                    targetPath,
                    sass.renderSync({
                        file: sourcePath,
                        outputStyle: 'expanded'
                    }).css
                );
            });

        log.success('Created CSS');

        resolve();
    });
}

gulp.task('scripts-css', task);
