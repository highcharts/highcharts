/*
 * Copyright (C) Highsoft AS
 */

/* eslint no-use-before-define: 0 */

const Gulp = require('gulp');
const Path = require('path');
const { readFileSync } = require('node:fs');

const { getGitIgnoreMeProperties } = require('./lib/uploadS3.js');

/* *
 *
 *  Constants
 *
 * */

const SOURCE_DIRECTORY = 'samples';

const TARGET_DIRECTORY = Path.join('build', 'dist');

const TEMPLATE_FILE = Path.join(SOURCE_DIRECTORY, 'template-example.htm');

const URL_REPLACEMENT = 'src="../../code/';
const logLib = require('./lib/log');

function getDemoBuildPath() {
    const config = getGitIgnoreMeProperties();
    let value;
    if (config) {
        value = config['demos.path'];
    }

    if (!value || !value.length) {
        logLib.message('git-ignore-me-properties is missing demos.path, trying default ./tmp/demo');
        value = 'tmp/demo';
    }
    return value;
}

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
            ul.nav > li > div {
                font-size: 1.5em;
                font-weight: bold;
                margin: 1em 0 0.3em 0;
            }
            ul.nav > li {
                list-style: none;
                display: black
            }
            div > ul > li {
                padding-bottom: 0.5em;
            }
            ul ul {
                list-style-type: initial;
                padding-left: 1.25em;
                font-size: 1.15em;
            }
            li button.sidebar-category {
                border: none;
                background: none;
                padding: 0;
                margin: 1rem 0 0.5rem 0;
                font-size: 1.4rem;
            }
            li a {
                text-decoration: none;
                color: #6065c8;
            }
            li a:hover {
                text-decoration: underline;
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
 * @return {Promise<void>}
 *         Promise to keep
 */
async function createExamples(title, sourcePath, targetPath, template) {

    const FS = require('fs');
    const FSLib = require('./lib/fs');
    const LogLib = require('./lib/log');

    const directoryPaths = FSLib.getDirectoryPaths(sourcePath);

    LogLib.success('Generating', targetPath + '...');

    directoryPaths.forEach(directoryPath => {

        let path;

        const content = [
            'html', 'css', 'js'
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

    function getLocalSidebar(path) {
        const sidebarPath =
            Path.join(getDemoBuildPath(), `${path === 'highcharts' ? '' : `/${path}`}/sidebar.html`);
        try {
            const file = readFileSync(sidebarPath,
                'utf-8');
            return file;

        } catch {
            throw new Error(`Could not find ${sidebarPath}
  If demos are built elsewhere, the path can be specified in git-ignore-me.properties by the demos.path property.`);
        }
    }

    LogLib.success('Created', targetPath);

    const localsidebar = getLocalSidebar(
        sourcePath
            .replaceAll('samples/', '')
            .replaceAll('/demo', '')
    );

    LogLib.success('Created', targetPath);
    const indexContent = localsidebar
        .replaceAll('style="display:none;"', '') // remove hidden style
        .replace(/(?!href= ")(\.\/.+?)(?=")/gu, 'examples\/$1\/index.html'); // replace links

    // eslint-disable-next-line node/no-unsupported-features/node-builtins
    return FS.promises.writeFile(
        Path.join(targetPath, '..', 'index.html'),
        indexTemplate({ title, content: indexContent })
    );
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

    return new Promise((resolve, reject) => {

        const promises = [];
        const samplesSubfolder = {
            highcharts: {
                path: ['highcharts', 'demo'],
                title: 'Highcharts'
            },
            highstock: {
                path: ['stock', 'demo'],
                title: 'Highstock'
            },
            highmaps: {
                path: ['maps', 'demo'],
                title: 'Highmaps'
            },
            gantt: {
                path: ['gantt', 'demo'],
                title: 'Highcharts Gantt'
            }
        };
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
                    template
                ));
            });

        Promise
            .all(promises)
            .then(resolve)
            .catch(reject);
    });
}

Gulp.task('dist-examples', distExamples);

module.exports = {
    getDemoBuildPath
};
