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
 * File extensions that should be distributed.
 */
const CODE_EXTENSIONS = ['.css', '.js', '.map'];

/**
 * Files that should not be distributed with certain products.
 */
const CODE_FILTER = {
    highcharts: [
        ['highcharts-gantt.'],
        ['highmaps.'],
        ['highstock.'],
        ['es-modules', 'highcharts-gantt.'],
        ['es-modules', 'highmaps.'],
        ['es-modules', 'highstock.'],
        ['es-modules', 'indicators'],
        ['es-modules', 'masters', 'highcharts-gantt.'],
        ['es-modules', 'masters', 'highmaps.'],
        ['es-modules', 'masters', 'highstock.'],
        ['es-modules', 'masters', 'indicators'],
        ['es-modules', 'masters', 'modules', 'canvasrenderer.experimental.'],
        ['es-modules', 'masters', 'modules', 'map.'],
        ['es-modules', 'masters', 'modules', 'map-parser.'],
        ['es-modules', 'modules', 'canvasrenderer.experimental.'],
        ['es-modules', 'modules', 'map.'],
        ['es-modules', 'modules', 'map-parser.'],
        ['indicators'],
        ['modules', 'canvasrenderer.experimental.'],
        ['modules', 'map.'],
        ['modules', 'map-parser.']
    ].map(
        filePath => Path.join(CODE_DIRECTORY, ...filePath)
    ),
    highstock: [
        ['highcharts.'],
        ['highcharts-gantt.'],
        ['highmaps.'],
        ['es-modules', 'highcharts.'],
        ['es-modules', 'highcharts-gantt.'],
        ['es-modules', 'highmaps.'],
        ['es-modules', 'masters', 'highcharts.'],
        ['es-modules', 'masters', 'highcharts-gantt.'],
        ['es-modules', 'masters', 'highmaps.'],
        ['es-modules', 'masters', 'modules', 'broken-axis.'],
        ['es-modules', 'masters', 'modules', 'canvasrenderer.experimental.'],
        ['es-modules', 'masters', 'modules', 'gantt.'],
        ['es-modules', 'masters', 'modules', 'map.'],
        ['es-modules', 'masters', 'modules', 'map-parser.'],
        ['es-modules', 'modules', 'broken-axis.'],
        ['es-modules', 'modules', 'canvasrenderer.experimental.'],
        ['es-modules', 'modules', 'gantt.'],
        ['es-modules', 'modules', 'map.'],
        ['es-modules', 'modules', 'map-parser.'],
        ['modules', 'broken-axis.'],
        ['modules', 'canvasrenderer.experimental.'],
        ['modules', 'gantt.'],
        ['modules', 'map.'],
        ['modules', 'map-parser.']
    ].map(
        filePath => Path.join(CODE_DIRECTORY, ...filePath)
    ),
    highmaps: [
        ['highcharts-gantt.'],
        ['highstock.'],
        ['es-modules', 'highcharts-gantt.'],
        ['es-modules', 'highstock.'],
        ['es-modules', 'indicators'],
        ['es-modules', 'masters', 'highcharts-gantt.'],
        ['es-modules', 'masters', 'highstock.'],
        ['es-modules', 'masters', 'indicators'],
        ['es-modules', 'masters', 'modules', 'broken-axis.'],
        ['es-modules', 'masters', 'modules', 'canvasrenderer.experimental.'],
        ['es-modules', 'masters', 'modules', 'gantt.'],
        ['es-modules', 'masters', 'modules', 'map-parser.'],
        ['es-modules', 'masters', 'modules', 'series-label.'],
        ['es-modules', 'masters', 'modules', 'solid-gauge.'],
        ['es-modules', 'modules', 'broken-axis.'],
        ['es-modules', 'modules', 'canvasrenderer.experimental.'],
        ['es-modules', 'modules', 'gantt.'],
        ['es-modules', 'modules', 'map-parser.'],
        ['es-modules', 'modules', 'series-label.'],
        ['es-modules', 'modules', 'solid-gauge.'],
        ['indicators'],
        ['modules', 'broken-axis.'],
        ['modules', 'canvasrenderer.experimental.'],
        ['modules', 'gantt.'],
        ['modules', 'map-parser.'],
        ['modules', 'series-label.'],
        ['modules', 'solid-gauge.']
    ].map(
        filePath => Path.join(CODE_DIRECTORY, ...filePath)
    ),
    gantt: [
        ['highcharts-3d.'],
        ['highcharts-more.'],
        ['highmaps.'],
        ['highstock.'],
        ['es-modules', 'highcharts-3d.'],
        ['es-modules', 'highcharts-more.'],
        ['es-modules', 'highmaps.'],
        ['es-modules', 'highstock.'],
        ['es-modules', 'indicators'],
        ['es-modules', 'masters', 'highcharts-3d.'],
        ['es-modules', 'masters', 'highcharts-more.'],
        ['es-modules', 'masters', 'highmaps.'],
        ['es-modules', 'masters', 'highstock.'],
        ['es-modules', 'masters', 'indicators'],
        ['es-modules', 'masters', 'modules', 'canvasrenderer.experimental.'],
        ['es-modules', 'masters', 'modules', 'map.'],
        ['es-modules', 'masters', 'modules', 'map-parser.'],
        ['es-modules', 'masters', 'modules', 'series-label.'],
        ['es-modules', 'masters', 'modules', 'solid-gauge.'],
        ['es-modules', 'masters', 'modules', 'stock.'],
        ['es-modules', 'modules', 'canvasrenderer.experimental.'],
        ['es-modules', 'modules', 'map.'],
        ['es-modules', 'modules', 'map-parser.'],
        ['es-modules', 'modules', 'series-label.'],
        ['es-modules', 'modules', 'solid-gauge.'],
        ['es-modules', 'modules', 'stock.'],
        ['indicators'],
        ['modules', 'canvasrenderer.experimental.'],
        ['modules', 'map.'],
        ['modules', 'map-parser.'],
        ['modules', 'series-label.'],
        ['modules', 'solid-gauge.'],
        ['modules', 'stock.']
    ].map(
        filePath => Path.join(CODE_DIRECTORY, ...filePath)
    )
};

/**
 * CSS files for style mode
 */
const CSS_DIRECTORY = 'css';

/**
 * Graphics for things
 */
const GFX_DIRECTORY = 'gfx';

/**
 * Graphics for things - again ¯\_(ツ)_/¯
 */
const GRAPHICS_DIRECTORY = Path.join('samples', 'graphics');

/**
 * Target directory
 */
const TARGET_DIRECTORY = Path.join('build', 'dist');

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
function distCopy() {

    const FsLib = require('./lib/fs');
    const LogLib = require('./lib/log');

    return new Promise(resolve => {

        let directory;

        LogLib.message('Copying files...');

        Object
            .keys(CODE_FILTER)
            .forEach(product => {

                const productFilter = CODE_FILTER[product];

                directory = Path.join(TARGET_DIRECTORY, product, 'code');

                FsLib.copyAllFiles(
                    CODE_DIRECTORY, directory, true,
                    sourcePath => (
                        !productFilter.some(
                            filterPath => sourcePath.startsWith(filterPath)
                        ) &&
                        CODE_EXTENSIONS.includes(Path.extname(sourcePath))
                    )
                    /*
                    if (targetPath.endsWith('.src.js')) {
                        return targetPath.replace('.src.js', '.js');
                    }

                    return (
                        productFilter.indexOf(sourcePath) === -1 &&
                        sourcePath.indexOf('.src.') === -1
                    );
                    */
                );

                LogLib.success('Created', directory);

                directory = Path.join(TARGET_DIRECTORY, product, 'code', 'css');
                FsLib.copyAllFiles(CSS_DIRECTORY, directory, true);
                FsLib.copyAllFiles(CODE_DIRECTORY + '/' + CSS_DIRECTORY, directory, true);
                LogLib.success('Created', directory);

                directory = Path.join(TARGET_DIRECTORY, product, 'code', 'lib');
                FsLib.copyAllFiles(
                    VENDOR_DIRECTORY, directory, false,
                    filePath => VENDOR_FILTER.some(
                        filterPath => filePath.startsWith(filterPath)
                    )
                );
                LogLib.success('Created', directory);

                directory = Path.join(TARGET_DIRECTORY, product, 'gfx');
                FsLib.copyAllFiles(GFX_DIRECTORY, directory, true);
                LogLib.success('Created', directory);

                directory = Path.join(TARGET_DIRECTORY, product, 'graphics');
                FsLib.copyAllFiles(GRAPHICS_DIRECTORY, directory, true);
                LogLib.success('Created', directory);
            });

        resolve();
    });
}

Gulp.task('dist-copy', distCopy);
