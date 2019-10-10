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

const INTERNAL_TARGET = path.join('build', 'api-internals');

const INTERNAL_THEME = path.join(
    'node_modules', 'highcharts-documentation-generators', 'typedoc',
    'theme-internals'
);

const NEXT_TARGET = path.join('build', 'api-next');

const NEXT_THEME = path.join(
    'node_modules', 'highcharts-documentation-generators', 'typedoc',
    'theme-next'
);

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

    const argv = require('yargs').argv;
    const processLib = require('./lib/process');

    const target = argv.next ? NEXT_TARGET : INTERNAL_TARGET;
    const theme = argv.next ? NEXT_THEME : INTERNAL_THEME;

    const command = (
        'cd ts && npx typedoc' +
        ` --json "${path.join('..', target, 'tree.json')}"` +
        ` --out "${path.join('..', target)}"` +
        ` --theme "${path.join('..', theme)}"`
    );

    return processLib
        .exec(command)
        .then(() => processLib.openAppFor(
            path.join((argv.next ? NEXT_TARGET : INTERNAL_TARGET), 'index.html')
        ));

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
