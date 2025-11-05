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
        ['es-modules', 'masters', 'modules', 'data-tools.'],
        ['indicators']

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
        ['es-modules', 'masters', 'modules', 'data-tools.'],
        ['es-modules', 'masters', 'modules', 'gantt.'],
        ['es-modules', 'masters', 'modules', 'map.'],
        ['es-modules', 'modules', 'broken-axis.'],
        ['es-modules', 'modules', 'gantt.'],
        ['es-modules', 'modules', 'map.'],
        ['modules', 'broken-axis.'],
        ['modules', 'gantt.'],
        ['modules', 'map.']
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
        ['es-modules', 'masters', 'modules', 'data-tools.'],
        ['es-modules', 'masters', 'modules', 'gantt.'],
        ['es-modules', 'masters', 'modules', 'series-label.'],
        ['es-modules', 'masters', 'modules', 'solid-gauge.'],
        ['es-modules', 'modules', 'broken-axis.'],
        ['es-modules', 'modules', 'gantt.'],
        ['es-modules', 'modules', 'series-label.'],
        ['es-modules', 'modules', 'solid-gauge.'],
        ['indicators'],
        ['modules', 'broken-axis.'],
        ['modules', 'gantt.'],
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
        ['es-modules', 'masters', 'modules', 'data-tools.'],
        ['es-modules', 'masters', 'modules', 'map.'],
        ['es-modules', 'masters', 'modules', 'series-label.'],
        ['es-modules', 'masters', 'modules', 'solid-gauge.'],
        ['es-modules', 'masters', 'modules', 'stock.'],
        ['es-modules', 'modules', 'map.'],
        ['es-modules', 'modules', 'series-label.'],
        ['es-modules', 'modules', 'solid-gauge.'],
        ['es-modules', 'modules', 'stock.'],
        ['indicators'],
        ['modules', 'map.'],
        ['modules', 'series-label.'],
        ['modules', 'solid-gauge.'],
        ['modules', 'stock.']
    ].map(
        filePath => Path.join(CODE_DIRECTORY, ...filePath)
    ),
    'grid-lite': [
        // The main cleanup is done in `scripts-ts` at the `code` level.
        ['grid', 'css', 'grid-pro.css'],
        ['grid', 'es-modules', 'Grid', 'Pro'],
        ['grid', 'es-modules', 'masters', 'grid-pro.'],
        ['grid', 'grid-pro.']
    ].map(
        filePath => Path.join(CODE_DIRECTORY, ...filePath)
    ),
    'grid-pro': [
        // The main cleanup is done in `scripts-ts` at the `code` level.
        ['grid', 'css', 'grid-lite.css'],
        ['grid', 'css', 'grid.css'],
        ['grid', 'es-modules', 'Grid', 'Lite'],
        ['grid', 'es-modules', 'masters', 'grid-lite.'],
        ['grid', 'grid-lite.']
    ].map(
        filePath => Path.join(CODE_DIRECTORY, ...filePath)
    ),
    dashboards: []
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
    'svg2pdf'
].map(
    filePath => Path.join(VENDOR_DIRECTORY, filePath + '.')
);

/**
 * Division into products.
 */
const PRODUCTS = {
    Highcharts: ['highcharts', 'highstock', 'highmaps', 'gantt'],
    Grid: ['grid-lite', 'grid-pro'],
    Dashboards: ['dashboards']
};

/* *
 *
 *  Tasks
 *
 * */

/**
 * Distribution copy
 *
 * @return {Promise<void>}
 * Promise to keep
 */
function distCopy() {

    const FsLib = require('../libs/fs');
    const LogLib = require('../libs/log');
    const argv = require('yargs').argv;

    const distProduct = argv.product || 'Highcharts';

    return new Promise(resolve => {

        let codeExtensions;
        let directory;
        let sourceDir;

        if (distProduct === 'Grid') {
            sourceDir = Path.join(CODE_DIRECTORY, 'grid');
            codeExtensions = [...CODE_EXTENSIONS, '.ts']; // copy also d.ts files
        } else if (distProduct === 'Dashboards') {
            sourceDir = Path.join(CODE_DIRECTORY, 'dashboards');
            codeExtensions = [...CODE_EXTENSIONS, '.ts']; // copy also d.ts files
        } else {
            sourceDir = CODE_DIRECTORY;
            codeExtensions = CODE_EXTENSIONS;
        }

        LogLib.message('Copying files...');

        for (const product of PRODUCTS[distProduct]) {

            const productFilter = CODE_FILTER[product];

            directory = Path.join(TARGET_DIRECTORY, product, 'code');

            FsLib.copyAllFiles(
                sourceDir, directory, true,
                sourcePath => (
                    !productFilter.some(
                        filterPath => sourcePath.startsWith(filterPath)
                    ) &&
                    codeExtensions.includes(Path.extname(sourcePath))
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

            if (distProduct === 'Grid') {
                // No need to copy CSS, GFX, i18n, and Graphics for Grid from root
                continue;
            }
            if (distProduct === 'Dashboards') {
                const dashGfx = Path.join(CODE_DIRECTORY, product, 'gfx');
                directory = Path.join(TARGET_DIRECTORY, product, 'gfx');
                FsLib.copyAllFiles(dashGfx, directory, true, file => (
                    file.includes('dashboards')
                ));
                LogLib.success('Created', directory);
                continue;
            }

            directory = Path.join(TARGET_DIRECTORY, product, 'code', 'css');

            // Copy all the CSS files to /code
            FsLib.copyAllFiles(CSS_DIRECTORY, directory, true, fileName => !['dashboards', 'grid']
                .some(name => fileName.includes(`${name}.css`)));

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

            // Copy i18n to /code
            if (distProduct === 'Highcharts') {
                directory = Path.join(TARGET_DIRECTORY, product, 'code', 'i18n');
                FsLib.copyAllFiles(
                    Path.join('i18n', 'highcharts'),
                    directory, true, filePath => filePath.endsWith('.json')
                );
                LogLib.success('Created', directory);
            }

            // Copy gfx to /code
            directory = Path.join(TARGET_DIRECTORY, product, 'gfx');
            FsLib.copyAllFiles(GFX_DIRECTORY, directory, true, fileName => !(fileName.includes('dashboards-icons')));
            LogLib.success('Created', directory);

            // Copy graphics to /code
            directory = Path.join(TARGET_DIRECTORY, product, 'graphics');
            FsLib.copyAllFiles(GRAPHICS_DIRECTORY, directory, true);
            LogLib.success('Created', directory);
        }

        resolve();
    });
}

Gulp.task('dist-copy', distCopy);
