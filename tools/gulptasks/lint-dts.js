/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

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
function task() {

    const ProcessLib = require('./lib/process');
    const LogLib = require('./lib/log');

    return new Promise((resolve, reject) => {

        LogLib.message('Linting ...');

        ProcessLib
            .exec('cd test/typescript && npx dtslint --onlyTestTsNext')
            .then(() => LogLib.success('Finished linting'))
            .then(resolve)
            .catch(reject);
    });
}

require('./jsdoc-dts');

Gulp.task('lint-dts', Gulp.series('jsdoc-dts', task));
