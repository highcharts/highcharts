/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const FILES = [
    './js/annotations',
    './js/annotations/types',
    './js/indicators',
    './js/modules',
    './js/modules/networkgraph',
    './js/modules/sonification',
    './js/parts',
    './js/parts-3d',
    './js/parts-more',
    './js/parts-map',
    './js/parts-gantt'
];

const SOURCE_FILE = 'tree.json';

const TARGET_DIRECTORY = 'build/api';

/* *
 *
 *  Functions
 *
 * */

/**
 * Creates the Highcharts API
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function createApiDocumentation() {

    const apiDocs = require('highcharts-documentation-generators').ApiDocs;
    const LogLib = require('./lib/log');

    return new Promise((resolve, reject) => {

        LogLib.message('Generating API documentation...');

        apiDocs(SOURCE_FILE, TARGET_DIRECTORY, true, error => {

            if (error) {
                LogLib.failure(error);
                reject(error);
            } else {
                LogLib.success('Generating API documentation done.');
                resolve();
            }
        });
    });
}

/**
 * Creates the `tree.json` file
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function createTreeJson() {

    const gulpJSDoc = require('gulp-jsdoc3');
    const LogLib = require('./lib/log');

    return new Promise((resolve, reject) => {

        const jsDocConfig = {
            plugins: [
                './node_modules/highcharts-documentation-generators/' +
                'jsdoc/plugins/highcharts.jsdoc'
            ]
        };

        Gulp
            .src(FILES, { read: false })
            .pipe(gulpJSDoc(
                jsDocConfig,
                error => {
                    if (error) {
                        LogLib.failure(error);
                        reject(error);
                    } else {
                        LogLib.success('Created tree.json');
                        resolve();
                    }
                }
            ));
    });
}

/**
 * Some tests for consistency of the `tree.json`.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function testTreeJson() {

    const FS = require('fs');

    return new Promise(resolve => {

        if (!FS.existsSync('tree.json')) {
            throw new Error('`tree.json` file not found.');
        }

        const treeJson = JSON.parse(FS.readFileSync(SOURCE_FILE, 'utf8'));

        if (Object.keys(treeJson.plotOptions.children).length < 66) {
            throw new Error(
                '`tree.json` file must contain at least 66 series types'
            );
        } else {
            resolve();
        }
    });
}

/* *
 *
 *  Tasks
 *
 * */

/**
 * Creates JSON-based option references from JSDoc.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function task() {

    return Promise
        .resolve()
        .then(createTreeJson)
        .then(testTreeJson)
        .then(createApiDocumentation);
}

Gulp.task('jsdoc-options', task);
