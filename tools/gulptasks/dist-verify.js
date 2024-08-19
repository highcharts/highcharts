/*
 * Copyright (C) Highsoft AS
 */

const { task } = require('gulp');
const assert = require('node:assert');
const { existsSync } = require('node:fs');
const { join } = require('node:path');
const { message } = require('../libs/log');

const DIST_DIR = './build/dist';
const HIGHCHARTS_PATHS = [
    'highcharts/code/es5',
    'highcharts/code/es-modules',
    'gantt/code',
    'highmaps/code',
    'highstock/code'
];
const DASHBOARDS_PATHS = [
    'dashboards/code/css/dashboards.css',
    'dashboards/code/gfx/dashboards-icons',
    'datagrid/js-gzip/css/datagrid.css'
];

/**
 * Checks the build directory for paths that should exist.
 *
 * @param  {object} argv
 *         Command line arguments
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
async function distVerify(argv) {
    const pathsToVerify = argv.dashboards ? DASHBOARDS_PATHS : HIGHCHARTS_PATHS;

    for (const path of pathsToVerify) {
        const distPath = join(DIST_DIR, path);

        message('Checking', distPath);

        assert(
            existsSync(distPath),
            'Path does not exist: ' + distPath
        );
    }

    const pathsThatShouldBeIgnored = [
        'highcharts/code/css/dashboards.css',
        'highcharts/code/css/datagrid.css',
        'highcharts/gfx/dashboards-icons'
    ];

    for (const path of pathsThatShouldBeIgnored) {
        const distPath = join(DIST_DIR, path);

        message('Checking', distPath);

        assert.strictEqual(
            existsSync(distPath),
            false,
            'Path that should not, does exist: ' + distPath
        );
    }
}

distVerify.description = 'Checks the build directory for paths that should exist.';
distVerify.flags = {
    '--dashboards': 'Only verify dashboards paths.'
};
task('dist-verify', () => distVerify(require('yargs').argv));

module.exports = {
    distVerify
};
