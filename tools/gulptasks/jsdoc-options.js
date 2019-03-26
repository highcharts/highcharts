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

const SOURCE_DIRECTORY = 'js';

const SOURCE_FILES = [
    ['annotations'],
    ['annotations', 'types'],
    ['indicators'],
    ['modules'],
    ['modules', 'accessibility'],
    ['modules', 'networkgraph'],
    ['modules', 'sonification'],
    ['parts'],
    ['parts-3d'],
    ['parts-more'],
    ['parts-map'],
    ['parts-gantt']
].map(
    filePath => Path.join(SOURCE_DIRECTORY, ...filePath)
);

const TARGET_DIRECTORY = Path.join('build', 'api');

const TREE_FILE = 'tree.json';

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
    const FS = require('fs');
    const LogLib = require('./lib/log');

    return new Promise((resolve, reject) => {

        LogLib.message('Generating', TARGET_DIRECTORY + '...');

        const sourceJSON = JSON.parse(FS.readFileSync(TREE_FILE));

        apiDocs(sourceJSON, TARGET_DIRECTORY, true, error => {

            if (error) {
                LogLib.failure(error);
                reject(error);
            } else {
                LogLib.success('Created', TARGET_DIRECTORY);
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
                Path.join(
                    'node_modules', 'highcharts-documentation-generators',
                    'jsdoc', 'plugins', 'highcharts.jsdoc'
                )
            ]
        };

        LogLib.success('Generating', TREE_FILE + '...');

        Gulp
            .src(SOURCE_FILES, { read: false })
            .pipe(gulpJSDoc(
                jsDocConfig,
                error => {
                    if (error) {
                        LogLib.failure(error);
                        reject(error);
                    } else {
                        LogLib.success('Created', TREE_FILE);
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

        if (!FS.existsSync(TREE_FILE)) {
            throw new Error(TREE_FILE + ' file not found.');
        }

        const treeJson = JSON.parse(FS.readFileSync(TREE_FILE, 'utf8'));

        if (Object.keys(treeJson.plotOptions.children).length < 66) {
            throw new Error(
                TREE_FILE + ' file must contain at least 66 series types'
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
function jsDocOptions() {

    return new Promise((resolve, reject) => {

        Promise
            .resolve()
            .then(createTreeJson)
            .then(testTreeJson)
            .then(createApiDocumentation)
            .then(() => resolve())
            .catch(reject);
    });
}

Gulp.task('jsdoc-options', jsDocOptions);
