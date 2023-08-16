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
async function testKarma() {

    const processLib = require('../lib/process');
    const logLib = require('../lib/log');

    const conf = path.join('test', 'typescript-karma', 'karma-conf.js');
    const tests = [
        path.join('Dashboards', '**', '*'),
        path.join('Data', '**', '*'),
        path.join('DataGrid', '**', '*'),
        path.join('Shared', '**', '*')
    ].join(',');

    await processLib.exec(`npx karma start ${conf} --tests ${tests}`);

    logLib.success('Karma tests successful');

}

gulp.task('dashboards/test-karma', gulp.series('scripts', testKarma));
