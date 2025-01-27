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
    const logLib = require('../libs/log');
    const processLib = require('../libs/process');

    return new Promise((resolve, reject) => {
        let product = 'highcharts';
        let productTSFolder = './ts';

        if (argv.dashboards) {
            product = 'dashboards';
            productTSFolder = './ts/Dashboards';
        } else if (argv.datagrid) {
            product = 'datagrid';
            productTSFolder = './ts/DataGrid';
        }

        logLib.message(`Linting TS files (.ts) for ${product} ...`);

        processLib
            .exec('npx eslint --quiet "' + SOURCE_GLOB + '"', {
                cwd: productTSFolder
            })
            .then(() => logLib.success('Finished linting'))
            .then(resolve)
            .catch(reject);
    });
}

lintTS.description = 'Run eslint on TypeScript files (.ts) in the ts folder';
lintTS.flags = {
    '--dashboards': 'Lint dashboards TypeScript files only',
    '--datagrid': 'Lint datagrid TypeScript files only'
};
gulp.task('lint-ts', () => lintTS(require('yargs').argv));

module.exports = {
    lintTS
};
