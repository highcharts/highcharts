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

/**
 * Source of generated files by the `scripts` task
 */
const CODE_DIRECTORY = 'code';

/**
 * Files that should not be distributed with certain products
 */
const CODE_FILTER = {
    highcharts: [
        ['highcharts-gantt.js'],
        ['highmaps.js'],
        ['highstock.js'],
        ['indicators'],
        ['modules', 'canvasrenderer.experimental.js'],
        ['modules', 'map.js'],
        ['modules', 'map-parser.js']
    ].map(
        filePath => Path.join(CODE_DIRECTORY, ...filePath)
    ),
    highstock: [
        ['highcharts.js'],
        ['highcharts-gantt.js'],
        ['highmaps.js'],
        ['modules', 'broken-axis.js'],
        ['modules', 'canvasrenderer.experimental.js'],
        ['modules', 'gantt.js'],
        ['modules', 'map.js'],
        ['modules', 'map-parser.js']
    ].map(
        filePath => Path.join(CODE_DIRECTORY, ...filePath)
    ),
    highmaps: [
        ['highcharts-gantt.js'],
        ['highstock.js'],
        ['indicators'],
        ['modules', 'broken-axis.js'],
        ['modules', 'canvasrenderer.experimental.js'],
        ['modules', 'gantt.js'],
        ['modules', 'map-parser.js'],
        ['modules', 'series-label.js'],
        ['modules', 'solid-gauge.js']
    ].map(
        filePath => Path.join(CODE_DIRECTORY, ...filePath)
    ),
    gantt: [
        ['highcharts-3d.js'],
        ['highcharts-more.js'],
        ['highmaps.js'],
        ['highstock.js'],
        ['indicators'],
        ['modules', 'canvasrenderer.experimental.js'],
        ['modules', 'map.js'],
        ['modules', 'map-parser.js'],
        ['modules', 'series-label.js'],
        ['modules', 'solid-gauge.js'],
        ['modules', 'stock.js']
    ].map(
        filePath => Path.join(CODE_DIRECTORY, ...filePath)
    )
};

/**
 * Additional files
 */
const VENDOR_DIRECTORY = 'vendor';

/**
 * Files that should be copied.
 */
const VENDOR_FILTER = [
    'canvg',
    'jspdf',
    'rgbcolor',
    'svg2pdf'
].map(
    filePath => Path.join(VENDOR_DIRECTORY, filePath + '.')
);

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

    const FsLib = require('./lib/fs');
    const LogLib = require('./lib/log');

    return new Promise(resolve => {

        const cssDirectory = 'css';
        const distDirectory = Path.join('build', 'dist');
        const gfxDirectory = 'gfx';
        const graphicsDirectory = Path.join('samples', 'graphics');

        let directory;

        LogLib.message('Copying files...');

        Object
            .keys(CODE_FILTER)
            .forEach(product => {

                const productFilter = CODE_FILTER[product];

                directory = Path.join(distDirectory, product, 'code');

                FsLib.copyAllFiles(
                    CODE_DIRECTORY, directory, true,
                    (sourcePath, targetPath) => {

                        if (targetPath.endsWith('.src.js')) {
                            return targetPath.replace('.src.js', '.js');
                        }

                        return (
                            productFilter.indexOf(CODE_FILTER) === -1 &&
                            sourcePath.indexOf('.src.') === -1
                        );
                    }
                );

                LogLib.success('Created', directory);

                directory = Path.join(distDirectory, product, 'code', 'css');
                FsLib.copyAllFiles(cssDirectory, directory, true);
                LogLib.success('Created', directory);

                directory = Path.join(distDirectory, product, 'code', 'lib');
                FsLib.copyAllFiles(
                    VENDOR_DIRECTORY, directory, false,
                    filePath => (VENDOR_FILTER.indexOf(filePath) === '0')
                );
                LogLib.success('Created', directory);

                directory = Path.join(distDirectory, product, 'gfx');
                FsLib.copyAllFiles(gfxDirectory, directory, true);
                LogLib.success('Created', directory);

                directory = Path.join(distDirectory, product, 'graphics');
                FsLib.copyAllFiles(graphicsDirectory, directory, true);
                LogLib.success('Created', directory);
            });

        resolve();
    });
}

Gulp.task('dist-copy', task);
