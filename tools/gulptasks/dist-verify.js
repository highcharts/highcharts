/*
 * Copyright (C) Highsoft AS
 */

const { task } = require('gulp');
const assert = require('node:assert');
const { existsSync } = require('node:fs');
const { join } = require('node:path');

const { message } = require('./lib/log');

const DIST_DIR = './build/dist';

/**
 * Checks the build directory for paths that should exist.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
async function verify() {
    const pathsToVerify = [
        'highcharts/code/es5',
        'highcharts/code/es-modules',
        'gantt/code',
        'highmaps/code',
        'highstock/code'
    ];

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

task('dist-verify', verify);
