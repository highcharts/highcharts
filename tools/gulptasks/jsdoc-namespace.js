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

const LINT_DIRECTORY = Path.join('test', 'typescript-lint');

const TREE_FILE = 'tree-namespace.json';

const TSCONFIG_FILE = Path.join(LINT_DIRECTORY, 'tsconfig.json');

const TARGET_DIRECTORIES = [
    'gantt',
    'highcharts',
    'highstock',
    'highmaps'
].map(
    directoryName => Path.join('build', 'api', directoryName)
);


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

    const FileSystem = require('../filesystem');
    const FS = require('fs');
    const jsdoc3 = require('gulp-jsdoc3');
    const LogLib = require('./lib/log');

    return new Promise((resolve, reject) => {

        if (!FS.existsSync('code/highcharts.src.js')) {
            Gulp.series('scripts-ts', 'scripts-js')(() => {});
        }

        const codeFiles = JSON
            .parse(FS.readFileSync(TSCONFIG_FILE)).files
            .map(file => Path.normalize(
                Path.join(Path.dirname(TSCONFIG_FILE), file)
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
                    Path.join(
                        'node_modules', 'highcharts-documentation-generators',
                        'jsdoc', 'plugins', 'highcharts.namespace'
                    )
                ]
            };

        if (codeFiles.length === 0) {
            reject(new Error('No files found in', TSCONFIG_FILE));
            return;
        }

        LogLib.message('Generating', TREE_FILE + '...');

        Gulp
            .src(...gulpOptions)
            .pipe(jsdoc3(jsdoc3Options, error => {

                if (error) {
                    reject(error);
                    return;
                }

                Promise
                    .all(
                        TARGET_DIRECTORIES.map(
                            targetDirectory => FileSystem.copyFile(
                                TREE_FILE,
                                Path.join(
                                    targetDirectory,
                                    Path.basename(TREE_FILE)
                                )
                            )
                        )
                    )
                    .then(() => LogLib.success('Created', TREE_FILE))
                    .then(resolve)
                    .catch(reject);
            }));
    });
}

Gulp.task('jsdoc-namespace', jsDocNamespace);
