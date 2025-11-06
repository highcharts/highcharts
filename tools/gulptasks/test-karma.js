/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const path = require('path');
const processLib = require('../libs/process');
const { buildCode } = require('./utils');

/* *
 *
 *  Tasks
 *
 * */

/**
 * Test TypeScript karma tests.
 *
 * @param  {object} argv
 *         Command line arguments
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
async function testKarma(argv) {
    const logLib = require('../libs/log');
    const conf = path.join('test', 'typescript-karma', 'karma-conf.js');

    if (argv.product === 'Dashboards') {
        await buildCode(['Highcharts', 'Grid', 'Dashboards']);
        await processLib.exec(`npx karma start ${conf} --product Dashboards`);
    } else if (argv.product === 'Grid') {
        await buildCode(['Grid']);
        await processLib.exec(`npx karma start ${conf} --product Grid`);
    } else if (argv.product === 'Highcharts') {
        await buildCode(['Highcharts']);
        await processLib.exec(`npx karma start ${conf} --product Highcharts`);
    } else {
        await buildCode(['Highcharts', 'Grid', 'Dashboards']);
        await processLib.exec(`npx karma start ${conf}`);
    }

    logLib.success('Karma tests successful');
}

gulp.task('test-karma', () => testKarma(require('yargs').argv));

module.exports = {
    testKarma
};
