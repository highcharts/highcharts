/*
 * Copyright (C) Highsoft AS
 */

const { task } = require('gulp');
const { existsSync } = require('node:fs');
const { join } = require('node:path');
const assert = require('node:assert');

const { message } = require('../lib/log');

const DIST_DIR = './build/dist';


/**
 * Checks the build directory for paths that should exist.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
async function verify() {
    const pathsToVerify = [
        'dashboards/code/css/dashboards.css',
        'dashboards/code/gfx/dashboards-icons',
        'datagrid/js-gzip/css/datagrid.css'
    ];

    for (const path of pathsToVerify) {
        const distPath = join(DIST_DIR, path);

        message('Checking', distPath);

        assert(
            existsSync(distPath),
            'Path does not exist: ' + distPath
        );
    }
}

task('dashboards/dist-verify', verify);
