/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Tasks
 *
 * */

/**
 * Lint test of TypeScript code.
 *
 * @return {Promise<void>}
 * Promise to keep with console output
 */
async function testLint() {

    const processLib = require('../lib/process');
    const logLib = require('../lib/log');

    logLib.message('Linting ./ts/Dashboards/**/*.ts ...');

    try {
        await processLib.exec('npx eslint --quiet "./**/*.ts"', {
            cwd: './ts/Dashboards'
        });
        logLib.success('Finished linting');
    } catch (error) {
        logLib.failure('Linting failed');
        throw error;
    }

}

gulp.task('dashboards/test-lint', testLint);
