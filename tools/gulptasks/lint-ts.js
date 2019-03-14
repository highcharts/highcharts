/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const SOURCE_GLOB = 'ts/masters/tsconfig-*.json';

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

    const Glob = require('glob');
    const LogLib = require('./lib/log');
    const ProcessLib = require('./lib/process');

    return new Promise((resolve, reject) => {

        LogLib.message('Linting [', SOURCE_GLOB, ']...');

        Promise
            .all(
                Glob
                    .sync(SOURCE_GLOB)
                    .map(file => ProcessLib.exec(
                        'npx tslint --project ' + file
                    ))
            )
            .then(() => LogLib.success('Finished linting', SOURCE_GLOB))
            .then(resolve)
            .catch(reject);
    });
}

Gulp.task('lint-ts', task);
