/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const SOURCE_GLOB = './**/*.ts';

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
function task() {

    const processLib = require('../lib/process');
    const logLib = require('../lib/log');

    return new Promise((resolve, reject) => {

        logLib.message('Linting [./Dashboards/**/*.ts]...');

        processLib
            .exec('cd ts/Dashboards && npx eslint --quiet "' + SOURCE_GLOB + '"')
            .then(() => logLib.success('Finished linting'))
            .then(resolve)
            .catch(reject);
    });
}

gulp.task('dashboards/lint', task);
