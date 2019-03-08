/*
 * Copyright (C) Highsoft AS
 */

/* eslint no-use-before-define: 0 */

const Gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

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

    const Fs = require('fs');
    const FsLib = require('./lib/fs');
    const LogLib = require('./lib/log');
    const MkDirP = require('mkdirp');
    const Path = require('path');

    return new Promise(resolve => {

        const directoryPaths = FsLib.getDirectoryPaths(sourcePath);

        directoryPaths.forEach(directoryPath => {

            let path;

            const content = [
                'html', 'css', 'js'
            ].reduce(
                (obj, ext) => {
                    path = Path.join(directoryPath, 'demo.' + ext);
                    obj[ext] = (
                        Fs.existsSync(path) &&
                        Fs.readFileSync(path).toString() ||
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

            Fs.writeFileSync(
                Path.join(path, 'index.htm'),
                convertURLToLocal(sample)
            );
        });

        FsLib.copyFile(
            Path.join(sourcePath, 'index.htm'),
            Path.join(targetPath, '..', 'index.htm')
        );

        LogLib.success('Created ' + targetPath);

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
function task() {

    const Fs = require('fs');
    const Path = require('path');

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
        const template = Fs
            .readFileSync('samples/template-example.htm')
            .toString();

        Object
            .keys(samplesSubfolder)
            .forEach(product => {
                promises.push(createExamples(
                    samplesSubfolder[product].title,
                    Path.join('samples', ...samplesSubfolder[product].path),
                    Path.join('build', 'dist', product, 'examples'),
                    template
                ));
            });

        Promise.all(promises).then(resolve).catch(reject);
    });
}

Gulp.task('dist-examples', task);
