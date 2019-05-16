/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

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

    const log = require('./lib/log');
    const process = require('./lib/process');

    return new Promise((resolve, reject) => {

        log.message('Linting [', SOURCE_GLOB, ']...');

        process
            .exec('cd ts && npx eslint ' + SOURCE_GLOB)
            .then(() => log.success('Finished linting'))
            .then(resolve)
            .catch(reject);
    });
}

gulp.task('lint-ts', task);
