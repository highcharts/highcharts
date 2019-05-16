/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const path = require('path');

/* *
 *
 *  Constants
 *
 * */

const SOURCE_CONFIGS = [
    'tsconfig-bullet.json'
].map(
    fileName => path.join('ts', 'masters-not-in-use-yet', fileName)
);

const TARGET_JSON = 'tree-typescript.json';

const TARGET_DIRECTORY = path.join('build', 'api');

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

    const generators = require('highcharts-documentation-generators');
    const log = require('./lib/log');

    return new Promise(resolve => {

        log.message('Generating', TARGET_DIRECTORY + '...');

        generators.TypeDoc
            .task(SOURCE_CONFIGS[0], TARGET_DIRECTORY, TARGET_JSON)
            .then(() => log.success('Created', TARGET_DIRECTORY))
            .then(resolve);
    });
}

gulp.task('tsdoc', gulp.series('clean-api', task));
