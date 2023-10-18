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

    const processLib = require('../lib/process');
    const logLib = require('../lib/log');

    await processLib.exec(
        'npx cypress run --config-file ' +
            path.join('test', 'cypress', 'configs', 'dashboards.config.mjs')
    );

    logLib.success('Cypress tests successful');

}

gulp.task('dashboards/cypress', testCypress);
