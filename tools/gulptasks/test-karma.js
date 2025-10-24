/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const path = require('path');

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
    const processLib = require('../libs/process');
    const logLib = require('../libs/log');
    const conf = path.join('test', 'typescript-karma', 'karma-conf.js');

    if (argv.product === 'Dashboards') {
        const tests = [
            path.join('Dashboards', '**', '*'),
            path.join('Data', '**', '*')
        ].join(',');
        await processLib.exec(`npx karma start ${conf} --tests ${tests}`);
    } else if (argv.product === 'Grid') {
        const tests = path.join('Grid', '*');
        await processLib.exec(`npx karma start ${conf} --tests ${tests}`);
    } else {
        await processLib.exec(`npx karma start ${conf}`);
    }

    logLib.success('Karma tests successful');
}

gulp.task('test-karma', () => testKarma(require('yargs').argv));

module.exports = {
    testKarma
};
