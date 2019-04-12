/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');
const Path = require('path');

/* *
 *
 *  Constants
 *
 * */

const LINT_FOLDER = Path.join('test', 'typescript-lint');

const TEST_FOLDER = Path.join('test', 'typescript');

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

    const FSLib = require('./lib/fs');
    const ProcessLib = require('./lib/process');
    const LogLib = require('./lib/log');

    return new Promise((resolve, reject) => {

        LogLib.message('Linting ...');

        const promises = [];

        promises.push(
            ProcessLib
                .exec('cd ' + LINT_FOLDER + ' && npx dtslint --onlyTestTsNext')
        );

        promises.push(
            ...FSLib
                .getDirectoryPaths(TEST_FOLDER, false)
                .map(folder => ProcessLib.exec('npx tsc -p ' + folder))
        );

        Promise
            .all(promises)
            .then(() => LogLib.success('Finished linting'))
            .then(resolve)
            .catch(reject);
    });
}

require('./jsdoc-dts');

Gulp.task('lint-dts', task);
