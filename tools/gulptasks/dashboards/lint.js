/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */


/* *
 *
 *  Tasks
 *
 * */

/**
 * Lint test of TypeScript code.
 *
 * @return {Promise<string>}
 *         Promise to keep with console output
 */
async function task() {

    const processLib = require('../lib/process');
    const logLib = require('../lib/log');
    const SOURCE_GLOB = './**/*.ts';
    logLib.message('Linting [./ts/Dashboards/**/*.ts]...');

    try {
        await processLib.exec('npx eslint --quiet "' + SOURCE_GLOB + '"', {
            cwd: './ts/Dashboards'
        });
        logLib.success('Finished linting');
    } catch (reject) {
        logLib.failure('Linting failed');
        throw new Error('Linting failed');
    }
}

gulp.task('dashboards/lint', task);
