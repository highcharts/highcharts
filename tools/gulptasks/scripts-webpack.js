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
    const fsLib = require('../libs/fs');
    const logLib = require('../libs/log');

    const {
        esModulesFolder
    } = require('./dashboards/_config.json');

    // Copy webpack-generated JS files to es-modules/masters for tests
    // Copy dashboards.src.js
    fsLib.copyFile(
        'code/dashboards/dashboards.src.js',
        esModulesFolder + '/masters/dashboards.src.js'
    );

    // Copy modules JS files if they exist
    if (fsLib.isDirectory('code/dashboards/modules')) {
        fsLib.copyAllFiles(
            'code/dashboards/modules/',
            esModulesFolder + '/masters/modules/',
            true,
            sourcePath => sourcePath.endsWith('.src.js')
        );
    }

    // Note: DTS and JS file copying is handled in scripts-ts.js to match Grid pattern
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
