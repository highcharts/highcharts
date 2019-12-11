/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const NEXT_TARGET = 'tree-next.json';

/* *
 *
 *  Tasks
 *
 * */

/**
 * @return {Promise<undefined>}
 *         Promise to keep
 */
function task() {

    const fs = require('fs');
    const generator = require('highcharts-documentation-generators').TypeScript;
    const logLib = require('./lib/log');

    return Promise
        .resolve()
        .then(() => fs.writeFileSync(
            NEXT_TARGET,
            generator.JSONUtilities.stringify(
                generator.Project.loadFromDirectory('ts').toJSON()
            )
        ))
        .then(logLib.success)
        .catch(logLib.failure);
}

gulp.task('tsdoc-next', task);
