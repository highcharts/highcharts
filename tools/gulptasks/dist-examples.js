/*
 * Copyright (C) Highsoft AS
 */

/* eslint no-use-before-define: 0 */

const Gulp = require('gulp');
const Path = require('path');

/* *
 *
 *  Constants
 *
 * */

const SOURCE_DIRECTORY = 'samples';

const TARGET_DIRECTORY = Path.join('build', 'dist');

const TEMPLATE_FILE = Path.join(SOURCE_DIRECTORY, 'template-example.htm');

const URL_REPLACEMENT = 'src="../../code/';

/* *
 *
 *  Functions
 *
 * */

/**
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
function createExamples(title, sourcePath, targetPath, template) {

    const FS = require('fs');
    const FSLib = require('./lib/fs');
    const LogLib = require('./lib/log');
    const MkDirP = require('mkdirp');

    return new Promise(resolve => {

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

            MkDirP.sync(path);

            FS.writeFileSync(
                Path.join(path, 'index.htm'),
                convertURLToLocal(sample)
            );
        });

        FSLib.copyFile(
            Path.join(sourcePath, 'index.htm'),
            Path.join(targetPath, '..', 'index.htm')
        );

        LogLib.success('Created', targetPath);

        resolve();
    });
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
        str, '../../js/mapdata', 'src="https://code.highcharts.com/mapdata'
    );

    return str;
}

/* *
 *
 *  Tasks
 *
 * */

/**
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
