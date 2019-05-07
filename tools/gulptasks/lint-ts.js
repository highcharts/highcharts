/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const SOURCE_GLOB = '**/*.ts';

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

    const LogLib = require('./lib/log');
    const ProcessLib = require('./lib/process');

    return new Promise((resolve, reject) => {

        LogLib.message('Linting [', SOURCE_GLOB, ']...');

        ProcessLib
            .exec('cd ts && npx eslint ' + SOURCE_GLOB)
            .then(() => LogLib.success('Finished linting'))
            .then(resolve)
            .catch(reject);
    });
}

Gulp.task('lint-ts', task);
