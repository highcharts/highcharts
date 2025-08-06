/*
 * Copyright (C) Highsoft AS
 */


const FS = require('node:fs');
const FSP = require('node:fs/promises');
const Gulp = require('gulp');
const Path = require('node:path');

/* *
 *
 *  Tasks
 *
 * */

/**
 * Post-webpack processing for Dashboards - copies webpack-generated files to es-modules
 *
 * @return {Promise<void>}
 * Promise to keep.
 */
async function postWebpackDashboards() {
    const fs = require('fs');
    const fsLib = require('../libs/fs');
    const logLib = require('../libs/log');
    const path = require('path');

    const {
        bundleTargetFolder,
        bundleTargetFolderGridPro,
        esModulesFolder,
        esModulesFolderGridPro
    } = require('./scripts-dts/dashboards/_config.json');

    // DTS processing constants (from dashboards/scripts-dts.js)
    const DTS_FILES = [
        'Core/Color/ColorString.d.ts',
        'Core/Color/ColorType.d.ts',
        'Core/Color/GradientColor.d.ts',
        'Core/Renderer/AlignObject.d.ts',
        'Core/Renderer/CSSObject.d.ts',
        'Core/Renderer/DashStyleValue.d.ts',
        'Core/Renderer/DOMElementType.d.ts',
        'Core/Renderer/HTML/HTMLAttributes.d.ts',
        'Core/Renderer/SVG/SVGAttributes.d.ts',
        'Core/Renderer/SVG/SVGPath.d.ts',
        'Shared/LangOptionsCore.d.ts'
    ].map(fsLib.path);

    const DTS_FOLDERS = [
        'Dashboards/',
        'Data/',
        'Grid/'
    ].map(fsLib.path);

    // Copy individual DTS files from ts/ to es-modules (Dashboards only)
    for (const dtsFile of DTS_FILES) {
        fsLib.copyFile(
            path.join('ts', dtsFile),
            path.join(esModulesFolder, dtsFile)
        );
    }

    // Copy DTS folders from ts/ to es-modules (Dashboards + Grid)
    // Grid folder is needed for Dashboards to use Grid components
    const dashboardsDtsFolders = ['Dashboards/', 'Data/', 'Grid/'].map(fsLib.path);
    for (const dtsFolder of dashboardsDtsFolders) {
        fsLib.copyAllFiles(
            path.join('ts', dtsFolder),
            path.join(esModulesFolder, dtsFolder),
            true,
            sourcePath => sourcePath.endsWith('.d.ts')
        );
    }

    logLib.success('Copied stand-alone DTS');

    // Process bundle DTS files (use permanent location)
    const bundleDtsFolder = path.join(__dirname, 'scripts-dts', 'dashboards');

    // Copy bundle DTS files to target folders (exclude config file and datagrid files)
    fsLib.copyAllFiles(
        bundleDtsFolder,
        bundleTargetFolder,
        true,
        sourcePath => !sourcePath.endsWith('_config.json') && !sourcePath.includes('datagrid')
    );

    // Transform bundle DTS files (.src.d.ts → .d.ts)
    const bundleDtsFiles = fsLib.getFilePaths(bundleDtsFolder, true);
    for (const bundleDtsFile of bundleDtsFiles) {
        // Skip config files and datagrid files
        if (bundleDtsFile.endsWith('_config.json') || bundleDtsFile.includes('datagrid')) {
            continue;
        }
        fs.writeFileSync(
            path.join(
                bundleTargetFolder,
                path
                    .relative(bundleDtsFolder, bundleDtsFile)
                    .replace(/\.src\.d\.ts$/u, '.d.ts')
            ),
            fs.readFileSync(bundleDtsFile, 'utf8').replace(/\.src"/gu, '"')
        );
    }

    logLib.success('Created bundle DTS');

    // Copy webpack-generated JS files to es-modules/masters for tests
    // Copy dashboards.src.js and dashboards.src.d.ts
    fsLib.copyFile(
        'code/dashboards/dashboards.src.js',
        esModulesFolder + '/masters/dashboards.src.js'
    );
    fsLib.copyFile(
        'code/dashboards/dashboards.src.d.ts',
        esModulesFolder + '/masters/dashboards.src.d.ts'
    );

    // Copy modules JS and DTS files if they exist
    if (fsLib.isDirectory('code/dashboards/modules')) {
        fsLib.copyAllFiles(
            'code/dashboards/modules/',
            esModulesFolder + '/masters/modules/',
            true,
            sourcePath => sourcePath.endsWith('.src.js') || sourcePath.endsWith('.src.d.ts')
        );
    }

    // Copy valid native DTS and JS files from js/ to esModulesFolder (matches original method)
    fsLib.copyAllFiles(
        'js/',
        esModulesFolder,
        true,
        sourcePath => sourcePath.endsWith('.d.ts') || sourcePath.endsWith('.js')
    );

    // Copy Grid Pro JS/DTS files to Dashboards es-modules for integration
    if (fsLib.isDirectory('code/grid/es-modules/Grid/')) {
        fsLib.copyAllFiles(
            'code/grid/es-modules/Grid/',
            path.join(esModulesFolder, 'Grid/'),
            true,
            sourcePath => sourcePath.endsWith('.d.ts') || sourcePath.endsWith('.js')
        );
    }
}

/**
 * Webpack task.
 *
 * @return {Promise<void>}
 * Promise to keep.
 */
async function scriptsWebpack() {

    const LogLib = require('../libs/log');
    const ProcessLib = require('../libs/process');

    const argv = require('yargs').argv;

    LogLib.message('Packing code...');

    let configs;
    if (argv.product === 'Grid') {
        configs = {
            Grid: 'grid.webpack.mjs'
        };
    } else if (argv.dashboards) {
        configs = {
            Dashboards: 'dashboards.webpack.mjs'
        };
    } else if (argv.product === 'Dashboards') {
        configs = {
            Grid: 'grid.webpack.mjs',
            Dashboards: 'dashboards.webpack.mjs'
        };
    } else {
        configs = {
            Highcharts: 'highcharts.webpack.mjs',
            HighchartsES5: 'highcharts-es5.webpack.mjs'
        };
    }

    if (FS.existsSync('webpack.log')) {
        await FSP.rm('webpack.log');
    }

    let config;
    let log = '';

    for (const productName of Object.keys(configs)) {
        config = Path.join('tools', 'webpacks', configs[productName]);

        if (argv.verbose) {
            LogLib.warn(config);
        }

        log += await ProcessLib.exec(
            `npx webpack -c ${config} --no-color`,
            {
                maxBuffer: 1024 * 1024,
                silent: argv.verbose ? 1 : 2,
                timeout: 60000
            }
        );

    }

    await FSP.writeFile('webpack.log', log, { flag: 'a' }); // 'a' - append

    LogLib.success('Finished packing.');

    // Post-webpack processing for Dashboards
    if (argv.product === 'Dashboards' || argv.dashboards) {
        await postWebpackDashboards();
    }

}

Gulp.task('scripts-webpack', scriptsWebpack);
