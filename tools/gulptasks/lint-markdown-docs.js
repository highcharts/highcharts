/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const glob = require('glob');

const markdownlint = require('markdownlint');

/* eslint-disable camelcase */

function task() {
    const logLib = require('./lib/log');

    logLib.message('Linting ...');

    const files = glob.sync('docs/**/*.md');

    const lintPromise = new Promise(resolve => {
        markdownlint({
            files,
            config: {
                default: false,
                MD033: {
                    allowed_elements: ['iframe']
                }
            }
        }, (errors, lints) => resolve({ errors, lints }));
    });


    return lintPromise.then(({ errors, lints }) => {
        if (errors) {
            logLib.failure(errors);
        }
        if (Object.entries(lints).length > 1) {
            logLib.warn('Uh-oh! Linting errors:\n', lints);
            throw new Error('Failed markdown lint');
        }
        logLib.success('Finished linting');
    });
}

gulp.task('lint-markdown', task);
