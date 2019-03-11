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
 * Creates CSS files
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function task() {

    const FS = require('fs');
    const FSLib = require('./lib/fs');
    const LogLib = require('./lib/log');
    const Path = require('path');
    const SASS = require('node-sass');

    return new Promise(resolve => {

        LogLib.message('Generating CSS...');

        FSLib.copyAllFiles('gfx', Path.join('code', 'gfx'), true);

        FSLib
            .getFilePaths('css', true)
            .forEach(
                filePath => FS.writeFileSync(
                    Path.join('code', filePath),
                    SASS.renderSync({
                        file: filePath,
                        outputStyle: 'expanded'
                    }).css
                )
            );

        LogLib.success('Created CSS');

        resolve();
    });
}

Gulp.task('scripts-css', task);
