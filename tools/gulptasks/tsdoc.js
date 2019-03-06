/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');
const Path = require('path');

const SOURCE_CONFIG = Path.join(
    '.', 'ts', 'masters-not-in-use-yet', 'tsconfig-bullet.json'
);

const SOURCE_DIRECTORY = Path.join('.', 'ts');

const TARGET_JSON = Path.join('.', 'tree-typescript.json');

const TARGET_DIRECTORY = Path.join('.', 'build', 'api');

Gulp.task('tsdoc', Gulp.series(
    'clean-api',
    () => require('highcharts-documentation-generators')
        .TypeDoc
        .task(SOURCE_CONFIG, TARGET_DIRECTORY, TARGET_JSON)
));

module.exports = {
    SOURCE_DIRECTORY
};
