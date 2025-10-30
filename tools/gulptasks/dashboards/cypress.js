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
 * Test Dashboards with Cypress.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
async function testCypress() {

    const processLib = require('../../libs/process');
    const logLib = require('../../libs/log');

    // Ensure Dashboards and Grid code are built before running Cypress
    await processLib.exec('npx gulp scripts --product Dashboards');
    await processLib.exec('npx gulp scripts --product Grid');

    await processLib.exec(
        'npx cypress run --config-file ' +
            path.join('test', 'cypress', 'dashboards', 'config.mjs')
    );

    logLib.success('Cypress tests successful');

}

gulp.task('dashboards/cypress', testCypress);
