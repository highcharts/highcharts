/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const SOURCE_GLOB = './**/*.spec.js';

/* *
 *
 *  Tasks
 *
 * */

/**
 * Lint test of Cypress code.
 *
 * @return {Promise<string>}
 *         Promise to keep with console output
 */
function task() {

    const logLib = require('./lib/log');
    const processLib = require('./lib/process');

    return new Promise((resolve, reject) => {

        logLib.message('Linting [', SOURCE_GLOB, ']...');

        processLib
            .exec('cd test/cypress && npx eslint --quiet "' + SOURCE_GLOB + '"')
            .then(() => logLib.success('Finished linting'))
            .then(resolve)
            .catch(reject);
    });
}

gulp.task('lint-cypress', task);
