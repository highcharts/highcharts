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

// const SOURCE_CONFIG = path.join('ts', 'tsconfig.json');

const TARGET_DIRECTORY = path.join('build', 'api-internals');

// const TARGET_JSON = path.join(TARGET_DIRECTORY, 'tree-typescript.json');

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

    const processLib = require('./lib/process');

    return processLib
        .exec('cd ts && npx typedoc --out ../' + TARGET_DIRECTORY)
        .then(() => processLib.openAppFor('build/api-internals/index.html'));
    /*
    const generators = require('highcharts-documentation-generators');
    const log = require('./lib/log');

    return new Promise(resolve => {

        log.message('Generating', TARGET_DIRECTORY + '...');

        generators.TypeDoc
            .task(SOURCE_CONFIG, TARGET_DIRECTORY, TARGET_JSON)
            .then(() => log.success('Created', TARGET_DIRECTORY))
            .then(resolve);
    });
    */
}

gulp.task('tsdoc', gulp.series('clean-api', task));
