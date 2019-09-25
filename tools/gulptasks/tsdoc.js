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

    const command = 'cd ts && npx typedoc' + (
        argv.next ?
            ` --json "${path.join('..', NEXT_TARGET, 'tree.json')}"` +
            ` --out "${path.join('..', NEXT_TARGET)}"` +
            ` --theme "${path.join('..', NEXT_THEME)}"` :
            ` --json "${path.join('..', INTERNAL_TARGET, 'tree.json')}"` +
            ` --out "${path.join('..', INTERNAL_TARGET)}"` +
            ` --theme "${path.join('..', INTERNAL_THEME)}"`
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
