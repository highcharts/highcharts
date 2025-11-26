/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');
const Path = require('path');
const ProcessLib = require('../libs/process');
const FsLib = require('../libs/fs');
const LogLib = require('../libs/log');
const { validateProduct } = require('./utils');

/* *
 *
 *  Tasks
 *
 * */

require('./dist-clean');
require('./dist-copy');
require('./dist-examples');
require('./dist-productsjs');
require('./jsdoc-dts');
require('./lint-dts');
require('./scripts-clean');
require('./scripts-css');
require('./scripts-js');
require('./scripts-webpack');

async function runDashboardsAll() {
    const preserveEnv = {
        ...process.env,
        HIGHCHARTS_SKIP_CODE_CLEAN: 'true',
        HIGHCHARTS_SKIP_BUILD_CLEAN: 'true',
        HIGHCHARTS_SKIP_DIST_CLEAN: 'true'
    };

    const steps = [
        {
            product: 'Highcharts',
            command: 'dist',
            cleanupDist: ['highcharts', 'highstock', 'highmaps', 'gantt']
        },
        {
            product: 'Grid',
            command: 'dist',
            env: preserveEnv,
            cleanupDist: ['grid-lite', 'grid-pro']
        },
        {
            product: 'Dashboards',
            command: 'dist',
            env: preserveEnv
        }
    ];

    for (const { product, command, env, cleanupDist } of steps) {
        const start = LogLib.starting(`${product} build`);
        await ProcessLib.exec(`npx gulp ${command} --product ${product}`, { env });
        LogLib.finished(`${product} build`, start);

        // Remove dist artifacts for HC and Grid, keep only for Dashboards
        if (cleanupDist) {
            cleanupDist.forEach(folder => {
                const distPath = Path.join('build', 'dist', folder);
                if (FsLib.isDirectory(distPath)) {
                    LogLib.message(`Removing ${distPath} (not needed in final dist)`);
                    FsLib.deleteDirectory(distPath);
                }
            });
        }
    }
}

function dist(callback) {
    const argv = require('yargs').argv;
    if (argv.dashboardsAll) {
        return runDashboardsAll();
    }
    const product = argv.product || 'Highcharts';

    if (!validateProduct(product)) {
        throw new Error(`The specified product '${product}' is not valid.`);
    }

    const tasks = [
        'lint-ts',
        'scripts-clean',
        'scripts',
        'scripts-compile',
        'dist-clean',
        'dist-copy',
        'dist-examples',
        'dist-productsjs'
    ];

    switch (product) {
        case 'Highcharts':
            tasks.push('jsdoc-dts');
            break;
        case 'Grid':
            tasks.push('grid/api-docs');
            break;
        case 'Dashboards':
            tasks.push('dashboards/api-docs');
            break;
        default:
    }

    tasks.push('lint-dts', 'dist-compress');

    return Gulp.series(tasks)(callback);
}

dist.description = 'Builds distribution files for the specified product.';
dist.flags = {
    '--product': 'Product name. Available products: Highcharts, Grid, Dashboards. Defaults to Highcharts.',
    '--dashboards-all': 'Builds Highcharts and Grid before Dashboards, keeping their code outputs for Dashboards testing.'
};
Gulp.task('dist', dist);
