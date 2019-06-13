/*
 * Copyright (C) Highsoft AS
 */

/* eslint no-use-before-define: 0 */

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
                gulp.series(...taskNames)(error => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
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
    requires
};
