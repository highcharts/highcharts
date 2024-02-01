/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const path = require('node:path');

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
    'highmaps',
    'highstock'
].map(
    directoryName => path.join('build', 'api', directoryName)
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

    const argv = require('yargs').argv;
    const fs = require('node:fs');
    const fsLib = require('./lib/fs');
    const gulpLib = require('./lib/gulp');
    const jsdoc = require('gulp-jsdoc3');
    const logLib = require('./lib/log');

    return new Promise((resolve, reject) => {

        const codeFiles = (
            argv.custom ?
                ['code/custom.src.js'] :
                JSON.parse(fs.readFileSync(TSCONFIG_FILE)).files
                    .map(file => path.normalize(
                        path.join(path.dirname(TSCONFIG_FILE), file)
                    ))
                    .filter(file => !file.includes('.src.d.ts'))
                    .map(file => file.replace(
                        /.d.ts$/u, '.src.js'
                    ))
        ).filter(file => !file.includes('global.src.js'));

        const gulpOptions = [codeFiles, { read: false }],
            jsdoc3Options = {
                plugins: [
                    path.posix.join(
                        'node_modules', '@highcharts',
                        'highcharts-documentation-generators', 'jsdoc',
                        'plugins', 'highcharts.namespace'
                    )
                ]
            };

        if (codeFiles.length === 0) {
            reject(new Error('No files found in', TSCONFIG_FILE));
            return;
        }

        gulpLib
            .requires(['code/highcharts.src.js'], ['scripts'])
            .then(() => logLib.message('Generating', TREE_FILE + '...'))
            .then(() => gulp.src(...gulpOptions).pipe(
                jsdoc(jsdoc3Options, error => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    Promise
                        .all(TARGET_DIRECTORIES.map(
                            targetDirectory => new Promise(done => {
                                fsLib.copyFile(
                                    TREE_FILE,
                                    path.join(
                                        targetDirectory,
                                        path.basename(TREE_FILE)
                                    )
                                );
                                done();
                            })
                        ))
                        .then(() => logLib.success('Created', TREE_FILE))
                        .then(resolve)
                        .catch(reject);
                })
            ))
            .catch(reject);
    });
}

gulp.task('jsdoc-namespace', jsDocNamespace);
