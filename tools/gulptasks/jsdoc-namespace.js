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

const INGNORED_MASTERS = [
    'data-tools', // internal
    'globals', // internal
    'highcharts-gantt', // = modules/gantt
    'highstock', // = modules/stock
    'highmaps', // = modules/maps
    'standalone-navigator' // external
];

const TREE_FILE = 'tree-namespace.json';

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
async function jsDocNamespace() {

    const argv = require('yargs').argv;
    const fsLib = require('./lib/fs');
    const gulpLib = require('./lib/gulp');
    const jsdoc = require('gulp-jsdoc3');
    const logLib = require('./lib/log');

    // Make sure master is in `code/`
    await gulpLib.requires(
        (
            argv.custom ?
                ['code/custom.src.js'] :
                ['code/highcharts.src.js']
        ),
        ['scripts']
    );

    const codeFiles = (
        argv.custom ?
            ['code/custom.src.js'] :
            [
                ...fsLib.getFilePaths('code/', false),
                ...fsLib.getFilePaths('code/modules', true),
                ...fsLib.getFilePaths('code/indicators', true),
                ...fsLib.getFilePaths('code/themes', true)
            ].filter(file => (
                file.endsWith('.src.js') &&
                !INGNORED_MASTERS.includes(path.basename(file, '.src.js'))
            ))
    );

    if (codeFiles.includes('code/highcharts.src.js')) {
        codeFiles.unshift(
            ...codeFiles.splice(codeFiles.indexOf('code/highcharts.src.js'), 1)
        );
    }

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
        throw new Error('No master files found in code/.');
    }

    logLib.message('Generating', TREE_FILE + '...');

    await new Promise((resolve, reject) => (
        gulp
            .src(...gulpOptions)
            .pipe(jsdoc(jsdoc3Options, error => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            }))
    ));

    for (const directory of TARGET_DIRECTORIES) {
        fsLib.copyFile(
            TREE_FILE,
            path.join(directory, path.basename(TREE_FILE))
        );
    }

    logLib.success('Created', TREE_FILE);
}

gulp.task('jsdoc-namespace', jsDocNamespace);
