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
 * Creates additional JSON-based class references with JSDoc using
 * tsconfig.json.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function task() {

    const FileSystem = require('../filesystem');
    const Fs = require('fs');
    const jsdoc3 = require('gulp-jsdoc3');
    const LogLib = require('./lib/log');
    const Path = require('path');

    return new Promise((resolve, reject) => {

        const dtsPath = 'test/typescript';

        const codeFiles = JSON
            .parse(Fs.readFileSync(Path.join(dtsPath, 'tsconfig.json'))).files
            .map(file => Path.join(dtsPath, file))
            .filter(file => (
                file.indexOf('test') !== 0 &&
                file.indexOf('global.d.ts') === -1 &&
                file.indexOf('.src.d.ts') === -1
            ))
            .map(file => file.replace(/.d.ts$/, '.src.js'));

        const productFolders = [
                'gantt',
                'highcharts',
                'highstock',
                'highmaps'
            ],
            gulpOptions = [codeFiles, { read: false }],
            jsdoc3Options = {
                plugins: [
                    'node_modules/highcharts-documentation-generators/' +
                    'jsdoc/plugins/highcharts.namespace'
                ]
            };

        if (codeFiles.length === 0) {
            LogLib.failure('No files in tsconfig.json found.');
            resolve([]);
        }

        LogLib.message('Generating tree-namespace.json...');

        Gulp.src(...gulpOptions)
            .pipe(jsdoc3(jsdoc3Options, error => {

                if (error) {
                    reject(error);
                    return;
                }

                Promise
                    .all(productFolders.map(
                        productFolder => FileSystem.copyFile(
                            'tree-namespace.json',
                            `build/api/${productFolder}/tree-namespace.json`
                        )
                    ))
                    .then(() => LogLib.success('Created tree-namespace.json'))
                    .then(resolve)
                    .catch(reject);
            }));
    });
}

Gulp.task('jsdoc-namespace', Gulp.series('scripts', task));
