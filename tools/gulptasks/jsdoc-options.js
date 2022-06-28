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
    'Accessibility/**/*',
    'Boost/**/*',
    'Core/**/*',
    'Data/**/*',
    'DataGrid/**/*',
    'Extensions/**/*',
    'Gantt/**/*',
    'Maps/**/*',
    'Stock/**/*',
    'Series/**/*'
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
 * Creates the `error.html` file
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function createErrorHtml() {
    const fs = require('fs');

    fs.writeFileSync(
        path.join(TARGET_DIRECTORY, 'error.html'),
        `<!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8" />
                <meta
                    http-equiv="refresh"
                    content="1;url=/highcharts/index.html"
                />
                <script type="text/javascript">
                    if (location.pathname.endsWith('.html')) {
                        location.href = '/highcharts/index.html';
                    } else if (location.pathname.endsWith('/')) {
                        location.href = (
                            location.pathname + 'index.html' +
                            (location.hash.length > 1 ? location.hash : '')
                        );
                    } else {
                        location.href = (
                            location.pathname + '.html' +
                            (location.hash.length > 1 ? location.hash : '')
                        );
                    }
                </script>
                <title>Highcharts API Reference</title>
            </head>
            <body>
                <p><a href="/highcharts/index.html">Redirect</a></p>
            </body>
        </html>
        `.replace(/\n {8,8}/gu, '\n')
    );
}

/**
 * Creates the Highcharts API
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function createApiDocumentation() {

    const apidocs = require(
            '@highcharts/highcharts-documentation-generators'
        ).ApiDocs,
        argv = require('yargs').argv,
        fs = require('fs'),
        log = require('./lib/log');

    return new Promise((resolve, reject) => {

        log.message('Generating', TARGET_DIRECTORY + '...');

        const sourceJSON = JSON.parse(fs.readFileSync(TREE_FILE)),
            products = argv.products && argv.products.split(',');

        apidocs(sourceJSON, TARGET_DIRECTORY, products, error => {

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
                    'node_modules', '@highcharts',
                    'highcharts-documentation-generators', 'jsdoc', 'plugins',
                    'highcharts.jsdoc'
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
            .then(createErrorHtml)
            .then(createTreeJson)
            .then(testTreeJson)
            .then(createApiDocumentation)
            .then(() => resolve())
            .catch(reject);
    });
}

gulp.task('jsdoc-options', jsDocOptions);
