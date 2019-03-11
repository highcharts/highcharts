/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');
const Path = require('path');

/* *
 *
 *  Constants
 *
 * */

const SOURCE_CONFIGS = [
    'tsconfig-bullet.json'
].map(
    fileName => Path.join('ts', 'masters-not-in-use-yet', fileName)
);

const TARGET_JSON = 'tree-typescript.json';

const TARGET_DIRECTORY = Path.join('build', 'api');

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

    const Generators = require('highcharts-documentation-generators');
    const LogLib = require('./lib/log');

    return new Promise(resolve => {

        LogLib.message('Generating', TARGET_DIRECTORY + '...');

        Generators.TypeDoc
            .task(SOURCE_CONFIGS[0], TARGET_DIRECTORY, TARGET_JSON)
            .then(() => LogLib.success('Created', TARGET_DIRECTORY))
            .then(resolve);
    });
}

Gulp.task('tsdoc', Gulp.series('clean-api', task));
