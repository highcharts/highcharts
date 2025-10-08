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
    const utils = require('./utils');

    const product = argv.product || 'Highcharts';
    let productTSFolder = './ts';

    if (!utils.validateProduct(product)) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        if (product === 'Dashboards') {
            productTSFolder = './ts/Dashboards';
        } else if (product === 'Grid') {
            productTSFolder = './ts/Grid';
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
    '--product': 'Lint project Typescript files only: Highcharts (default), Grid, Dashboards'
};
gulp.task('lint-ts', () => lintTS(require('yargs').argv));

module.exports = {
    lintTS
};
