/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const path = require('path');

/* *
 *
 *  Constants
 *
 * */

const LINT_FOLDER = path.join('test', 'typescript-lint');

const TEST_FOLDER = path.join('test', 'typescript');

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

    const fs = require('./lib/fs');
    const process = require('./lib/process');
    const log = require('./lib/log');

    return new Promise((resolve, reject) => {

        log.message('Linting ...');

        const promises = [];

        promises.push(
            process
                .exec('cd ' + LINT_FOLDER + ' && npx dtslint --onlyTestTsNext')
        );

        promises.push(
            ...fs
                .getDirectoryPaths(TEST_FOLDER, false)
                .map(folder => process.exec('npx tsc -p ' + folder))
        );

        Promise
            .all(promises)
            .then(() => log.success('Finished linting'))
            .then(resolve)
            .catch(reject);
    });
}

require('./jsdoc-dts');

gulp.task('lint-dts', task);
