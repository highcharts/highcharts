/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

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
    const Path = require('path');

    const SOURCE_CONFIG = Path.join(
        '.', 'ts', 'masters-not-in-use-yet', 'tsconfig-bullet.json'
    );

    const TARGET_JSON = Path.join('.', 'tree-typescript.json');

    const TARGET_DIRECTORY = Path.join('.', 'build', 'api');

    return Generators
        .TypeDoc
        .task(SOURCE_CONFIG, TARGET_DIRECTORY, TARGET_JSON)
        .then(() => {});
}

Gulp.task('tsdoc', Gulp.series('clean-api', task));
