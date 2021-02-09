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
    const generator = require('highcharts-documentation-generators').TypeScript4;
    const logLib = require('./lib/log');

    return Promise
        .resolve()
        .then(() => fs.writeFileSync(
            NEXT_TARGET,
            generator.JSON.stringify(
                generator.OptionDoc.load('ts', 'apioption', 'optionparent').toJSON()
            )
        ))
        .then(logLib.success)
        .catch(logLib.failure);
}

gulp.task('tsdoc-next', task);
