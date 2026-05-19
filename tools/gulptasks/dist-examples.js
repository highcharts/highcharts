/*
 * Copyright (C) Highsoft AS
 */

/* eslint no-use-before-define: 0 */

const Babel = require('@babel/core');
const Gulp = require('gulp');
const Path = require('path');
const { createDemoIndexContent } = require('./lib/demoIndex.js');

/* *
 *
 *  Constants
 *
 * */

const SOURCE_DIRECTORY = 'samples';

const TARGET_DIRECTORY = Path.join('build', 'dist');

const TEMPLATE_FILE = Path.join(SOURCE_DIRECTORY, 'template-example.htm');

const URL_REPLACEMENT = 'src="../../code/';

/**
 * Creates an index page from the supplied options
 * @param {{title: string, content: string}} options
 * The options for the index
 * @return {string}
 * An HTML string
 */
function indexTemplate(options) {
    const { title, content } = options;
    return `
<!DOCTYPE HTML>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${title} Examples</title>
        <style>
            * {
                font-family: sans-serif;
            }
            body {
                margin: 1rem 1.5rem;
            }
            .sidebar-category-list,
            .sidebar-demo-list {
                list-style: none;
                padding-left: 0;
                margin-left: 0;
            }
            .sidebar-category-group {
                margin: 0 0 1rem 0;
            }
            .sidebar-category {
                font-size: 1.5em;
                font-weight: bold;
                margin: 1em 0 0.3em 0;
            }
            .sidebar-demo-list {
                padding-left: 1.25em;
                font-size: 1.15em;
            }
            .sidebar-demo-list > li {
                padding-bottom: 0.5em;
            }
            a {
                text-decoration: none;
                color: #6065c8;
            }
            a:hover {
                text-decoration: underline;
            }
            @media (prefers-color-scheme: dark) {
                body {
                    background-color: #141414;
                    color: #ddd;
                }
                a {
                    color: #2caffe;
                }
            }
        </style>
    </head>
    <body>
    <h1>${title} Examples</h1>
    ${content}
    </body>
</html>`;
}

/* *
 *
 *  Functions
 *
 * */

/**
 * Assembles samples
 *
 * @param {string} template
 *        Template string
 *
 * @param {object} variables
 *        Template variables
 *
 * @return {string}
 *         Assembled template string
 */
function assembleSample(template, variables) {

    return Object
        .keys(variables)
        .reduce(
            (str, name) => str.replace('@demo.' + name + '@', variables[name]),
            template
        );
}

/**
 * Creates examples
 *
 * @param {string} title
 *        Example title
 *
 * @param {string} sourcePath
 *        Source path
 *
 * @param {string} targetPath
 *        Target path
 *
 * @param {string} template
 *        Template string
 *
 * @param {string} demoIndexProductPath
 *        Demo index product path
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
async function createExamples(title, sourcePath, targetPath, template, demoIndexProductPath) {

    const FS = require('fs');
    const FSLib = require('../libs/fs');
    const LogLib = require('../libs/log');

    const directoryPaths = FSLib.getDirectoryPaths(sourcePath);

    LogLib.success('Generating', targetPath + '...');

    directoryPaths.forEach(directoryPath => {

        let path;

        const content = [
            'html', 'css', 'js', 'ts'
        ].reduce(
            (obj, ext) => {
                path = Path.join(directoryPath, 'demo.' + ext);
                obj[ext] = (
                    FS.existsSync(path) &&
                    FS.readFileSync(path).toString() ||
                    ''
                );
                return obj;
            },
            { title }
        );

        if (content.ts) {
            content.js = '/* eslint-disable */\n' +
                Babel.transformSync(content.ts, {
                    presets: ['@babel/preset-typescript'],
                    filename: Path.join(directoryPath, 'demo.ts')
                }).code;
        }

        const sample = assembleSample(template, content);

        path = Path.join(
            targetPath, directoryPath.substr(sourcePath.length)
        );

        FS.mkdirSync(path, { recursive: true });

        FS.writeFileSync(
            Path.join(path, 'index.html'),
            convertURLToLocal(sample)
        );
    });

    const indexContent = createDemoIndexContent({
        productPath: demoIndexProductPath,
        sourcePath
    });

    // eslint-disable-next-line node/no-unsupported-features/node-builtins
    return FS.promises.writeFile(
        Path.join(targetPath, '..', 'index.html'),
        indexTemplate({ title, content: indexContent })
    ).then(() => LogLib.success('Created', targetPath));
}

/**
 * Converts URLs to relative local path.
 *
 * @param {string} str
 *        String containing URLs
 *
 * @return {string}
 *         String containing converted URLs
 */
function convertURLToLocal(str) {

    const StringLib = require('./lib/string');

    str = StringLib.replaceAll(
        str, 'src="https://code.highcharts.com/stock/', URL_REPLACEMENT
    );
    str = StringLib.replaceAll(
        str, 'src="https://code.highcharts.com/maps/', URL_REPLACEMENT
    );
    str = StringLib.replaceAll(
        str, 'src="https://code.highcharts.com/gantt/', URL_REPLACEMENT
    );
    str = StringLib.replaceAll(
        str, 'src="https://code.highcharts.com/', URL_REPLACEMENT
    );
    str = StringLib.replaceAll(
        str, 'src="../../code/mapdata', 'src="https://code.highcharts.com/mapdata'
    );

    return str;
}

/* *
 *
 *  Tasks
 *
 * */

/**
 * Creates examples for distribution.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function distExamples() {
    const FS = require('fs');
    const argv = require('yargs').argv;
    const distProduct = argv.product || 'Highcharts';

    return new Promise((resolve, reject) => {

        const promises = [];
        let samplesSubfolder = {};

        if (distProduct === 'Highcharts') {
            samplesSubfolder = {
                highcharts: {
                    path: ['highcharts', 'demo'],
                    title: 'Highcharts',
                    demoIndexProductPath: 'highcharts'
                },
                highstock: {
                    path: ['stock', 'demo'],
                    title: 'Highstock',
                    demoIndexProductPath: 'stock'
                },
                highmaps: {
                    path: ['maps', 'demo'],
                    title: 'Highmaps',
                    demoIndexProductPath: 'maps'
                },
                gantt: {
                    path: ['gantt', 'demo'],
                    title: 'Highcharts Gantt',
                    demoIndexProductPath: 'gantt'
                }
            };
        } else if (distProduct === 'Grid') {
            samplesSubfolder = {
                'grid-lite': {
                    path: ['grid-lite', 'demo'],
                    title: 'Highcharts Grid Lite',
                    demoIndexProductPath: 'grid-lite'
                },
                'grid-pro': {
                    path: ['grid-pro', 'demo'],
                    title: 'Highcharts Grid Pro',
                    demoIndexProductPath: 'grid-pro'
                }
            };
        } else if (distProduct === 'Dashboards') {
            samplesSubfolder = {
                dashboards: {
                    path: ['dashboards', 'demo'],
                    title: 'Highcharts Dashboards',
                    demoIndexProductPath: 'dashboards'
                }
            };
        }

        const template = FS
            .readFileSync(TEMPLATE_FILE)
            .toString();

        Object
            .keys(samplesSubfolder)
            .forEach(product => {
                promises.push(createExamples(
                    samplesSubfolder[product].title,
                    Path.join(
                        SOURCE_DIRECTORY, ...samplesSubfolder[product].path
                    ),
                    Path.join(TARGET_DIRECTORY, product, 'examples'),
                    template,
                    samplesSubfolder[product].demoIndexProductPath
                ));
            });

        Promise
            .all(promises)
            .then(resolve)
            .catch(reject);
    });
}

Gulp.task('dist-examples', distExamples);
