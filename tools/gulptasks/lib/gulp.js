/*
 * Copyright (C) Highsoft AS
 */

/* eslint-disable consistent-return, no-use-before-define */

const gulp = require('gulp');

/* *
 *
 *  Functions
 *
 * */

/**
 * Run gulp tasks if glob pattern does not match anything.
 *
 * @param {Array<string>} globPatterns
 *        Glob pattern to check
 *
 * @param {Array<string>} taskNames
 *        Names of gulp tasks to run
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function requires(globPatterns, taskNames) {

    const glob = require('glob').sync;

    return new Promise((resolve, reject) => {
        try {
            if (globPatterns.length === 0 ||
                globPatterns.some(globPattern =>
                    glob(globPattern, { allowEmpty: true }).length === 0)
            ) {
                taskNames.forEach(taskName => require('../' + taskName));
                run(...taskNames).then(resolve);
            } else {
                resolve();
            }
        } catch (catchedError) {
            reject(catchedError);
        }
    });
}

/**
 * Run gulp tasks asynchronously.
 *
 * @param {Array<string>} taskNames
 *        Names of gulp tasks to run
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function run(...taskNames) {
    return new Promise((resolve, reject) => {
        try {
            gulp.series(...taskNames)(error => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        } catch (catchedError) {
            reject(catchedError);
        }
    });
}

/* *
 *
 *  Exports
 *
 * */

module.exports = {
    requires,
    run
};
