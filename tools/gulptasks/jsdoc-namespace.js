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

const LINT_DIRECTORY = path.join('test', 'typescript-lint');

const TREE_FILE = 'tree-namespace.json';

const TSCONFIG_FILE = path.join(LINT_DIRECTORY, 'tsconfig.json');

const TARGET_DIRECTORIES = [
    'gantt',
    'highcharts',
    'highstock',
    'highmaps'
].map(
    directoryName => path.join('build', 'api', directoryName)
);

/* *
 *
 *  Functions
 *
 * */

/**
 * Checks necessary code files.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function checkCode() {

    const fs = require('fs');

    if (fs.existsSync('code/highcharts.src.js')) {
        return Promise.resolve();
    }

    return new Promise(resolve => {
        gulp.series('scripts-ts', 'scripts-js')(resolve);
    });
}

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
function jsDocNamespace() {

    const fsys = require('../filesystem');
    const fs = require('fs');
    const jsdoc = require('gulp-jsdoc3');
    const log = require('./lib/log');

    return new Promise((resolve, reject) => {

        const codeFiles = JSON
            .parse(fs.readFileSync(TSCONFIG_FILE)).files
            .map(file => path.normalize(
                path.join(path.dirname(TSCONFIG_FILE), file)
            ))
            .filter(file => (
                file.indexOf('global.d.ts') === -1 &&
                file.indexOf('.src.d.ts') === -1
            ))
            .map(file => file.replace(
                /.d.ts$/, '.src.js'
            ));

        const gulpOptions = [codeFiles, { read: false }],
            jsdoc3Options = {
                plugins: [
                    path.join(
                        'node_modules', 'highcharts-documentation-generators',
                        'jsdoc', 'plugins', 'highcharts.namespace'
                    )
                ]
            };

        if (codeFiles.length === 0) {
            reject(new Error('No files found in', TSCONFIG_FILE));
            return;
        }

        log.message('Generating', TREE_FILE + '...');

        gulp
            .src(...gulpOptions)
            .pipe(jsdoc(jsdoc3Options, error => {

                if (error) {
                    reject(error);
                    return;
                }

                Promise
                    .all(
                        TARGET_DIRECTORIES.map(
                            targetDirectory => fsys.copyFile(
                                TREE_FILE,
                                path.join(
                                    targetDirectory,
                                    path.basename(TREE_FILE)
                                )
                            )
                        )
                    )
                    .then(() => log.success('Created', TREE_FILE))
                    .then(resolve)
                    .catch(resolve);
            }));
    });
}

gulp.task('jsdoc-namespace', gulp.series(checkCode, jsDocNamespace));
