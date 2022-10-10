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
 * TSDoc-next task
 * @return {Promise<void>}
 *         Promise to keep
 */
function task() {

    const fs = require('fs');
    const generator = require(
        '@highcharts/highcharts-documentation-generators'
    ).TypeScript4;
    const logLib = require('./lib/log');

    return Promise
        .resolve()
        .then(() => fs.writeFileSync(
            NEXT_TARGET,
            generator.JSON.stringify(
                generator.ProjectDoc.load('ts').toJSON()
            )
        ))
        .then(logLib.success)
        .catch(logLib.failure);
}

gulp.task('tsdoc-next', task);
