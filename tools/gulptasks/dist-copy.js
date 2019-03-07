/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

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

    const FsLib = require('./lib/fs.js');
    const Path = require('path');

    return new Promise(() => {

        const codeDirectory = 'code';
        const cssDirectory = 'css';
        const distDirectory = Path.join('build', 'dist');
        const vendorDirectory = 'vendor';

        // Files that should not be distributed with certain products
        const codeFilter = {
            highcharts: [
                ['highcharts-gantt.js'],
                ['highmaps.js'],
                ['highstock.js'],
                ['indicators'],
                ['modules', 'canvasrenderer.experimental.js'],
                ['modules', 'map.js'],
                ['modules', 'map-parser.js']
            ].map(
                filePath => Path.join(codeDirectory, ...filePath)
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
                filePath => Path.join(codeDirectory, ...filePath)
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
                filePath => Path.join(codeDirectory, ...filePath)
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
                filePath => Path.join(codeDirectory, ...filePath)
            )
        };

        const vendorFilter = [
            'canvg',
            'jspdf',
            'rgbcolor',
            'svg2pdf'
        ].map(
            filePath => Path.join(vendorDirectory, filePath + '.')
        );

        FsLib.copyAllFiles(
            cssDirectory,
            Path.join(codeDirectory, 'css'),
            true
        );

        FsLib.copyAllFiles(
            vendorDirectory,
            Path.join(codeDirectory, 'lib'),
            false,
            filePath => (vendorFilter.indexOf(filePath) === '0')
        );

        Object
            .keys(codeFilter)
            .forEach(product => {

                const productFilter = codeFilter[product];

                FsLib.copyAllFiles(
                    codeDirectory,
                    Path.join(distDirectory, product, 'code'),
                    true,
                    (sourcePath, targetPath) => {

                        if (targetPath.endsWith('.src.js')) {
                            return targetPath.replace('.src.js', '.js');
                        }

                        return (
                            productFilter.indexOf(codeFilter) === -1 &&
                            sourcePath.indexOf('.src.') === -1 &&
                            (
                                sourcePath.endsWith('.js') ||
                                sourcePath.endsWith('.js.map') ||
                                sourcePath.endsWith('.css')
                            )
                        );
                    }
                );
            });
    });
}

Gulp.task('dist-copy', task);
