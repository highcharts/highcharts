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
 * Test TypeScript declarations in the code folder using tsconfig.json.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
async function testDTS() {

    const processLib = require('../lib/process');
    const logLib = require('../lib/log');

    await processLib.exec(
        'npx tsc -p ' +
        path.join('test', 'typescript-dts', 'dashboards')
    );

    logLib.success('Test DTS successful');

}

gulp.task('dashboards/test-dts', testDTS);
