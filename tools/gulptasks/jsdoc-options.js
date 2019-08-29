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

const SOURCE_DIRECTORY = 'js';

const SOURCE_GLOBS = [
    'annotations/**/*',
    'indicators/**/*',
    'modules/**/*',
    'parts/**/*',
    'parts-*/**/*'
].map(
    glob => SOURCE_DIRECTORY + '/' + glob
);

const TARGET_DIRECTORY = path.join('build', 'api');

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

    const apidocs = require('highcharts-documentation-generators').ApiDocs;
    const fs = require('fs');
    const log = require('./lib/log');

    return new Promise((resolve, reject) => {

        log.message('Generating', TARGET_DIRECTORY + '...');

        const sourceJSON = JSON.parse(fs.readFileSync(TREE_FILE));

        apidocs(sourceJSON, TARGET_DIRECTORY, true, error => {

            if (error) {
                log.failure(error);
                reject(error);
            } else {
                log.success('Created', TARGET_DIRECTORY);
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

    const jsdoc = require('gulp-jsdoc3');
    const log = require('./lib/log');

    return new Promise((resolve, reject) => {

        const jsDocConfig = {
            plugins: [
                path.join(
                    'node_modules', 'highcharts-documentation-generators',
                    'jsdoc', 'plugins', 'highcharts.jsdoc'
                )
            ]
        };

        log.success('Generating', TREE_FILE + '...');

        gulp
            .src(SOURCE_GLOBS, { read: false })
            .pipe(jsdoc(
                jsDocConfig,
                error => {
                    if (error) {
                        log.failure(error);
                        reject(error);
                    } else {
                        log.success('Created', TREE_FILE);
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

    const fs = require('fs');

    return new Promise(resolve => {

        if (!fs.existsSync(TREE_FILE)) {
            throw new Error(TREE_FILE + ' file not found.');
        }

        const treeJson = JSON.parse(fs.readFileSync(TREE_FILE, 'utf8'));

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

gulp.task('jsdoc-options', jsDocOptions);
