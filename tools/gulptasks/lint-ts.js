/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const SOURCE_GLOB = './**/*.ts';

/* *
 *
 *  Tasks
 *
 * */

/**
 * Lint test of TypeScript code (.ts).
 *
 * @param  {object} argv
 *         Command line arguments
 *
 * @return {Promise<string>}
 *         Promise to keep with console output
 */
function lintTS(argv) {
    const logLib = require('./lib/log');
    const processLib = require('./lib/process');

    return new Promise((resolve, reject) => {
        logLib.message(`Linting TS files (.ts) for ${argv.dashboards ? 'dashboards' : 'highcharts'} ...`);

        processLib
            .exec('npx eslint --quiet "' + SOURCE_GLOB + '"', {
                cwd: argv.dashboards ? './ts/Dashboards' : './ts'
            })
            .then(() => logLib.success('Finished linting'))
            .then(resolve)
            .catch(reject);
    });
}

lintTS.description = 'Run eslint on TypeScript files (.ts) in the ts folder';
lintTS.flags = {
    '--dashboards': 'Lint dashboards TypeScript files only'
};
gulp.task('lint-ts', () => lintTS(require('yargs').argv));

module.exports = {
    lintTS
};
