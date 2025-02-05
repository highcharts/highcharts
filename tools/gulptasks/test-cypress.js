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
 * Test Product with Cypress.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
async function testCypress() {
    const processLib = require('../libs/process');
    const logLib = require('../libs/log');
    const argv = require('yargs').argv;
    const product = argv.product;

    if (!product) {
        return;
    }

    logLib.success('Cypress tests running ' + product + '...');

    await processLib.exec(
        'npx cypress run --config-file ' +
            path.join('test', 'cypress', product, 'config.mjs')
    );

    logLib.success('Cypress tests successful');
}

gulp.task('test-cypress', testCypress);
