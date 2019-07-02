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

    const fsLib = require('./lib/fs');
    const processLib = require('./lib/process');
    const logLib = require('./lib/log');

    return new Promise((resolve, reject) => {

        logLib.message('Linting ...');

        const promises = [];

        promises.push(
            processLib
                .exec('cd ' + LINT_FOLDER + ' && npx dtslint --onlyTestTsNext')
        );

        promises.push(
            ...fsLib
                .getDirectoryPaths(TEST_FOLDER, false)
                .map(folder => processLib.exec('npx tsc -p ' + folder))
        );

        Promise
            .all(promises)
            .then(() => logLib.success('Finished linting'))
            .then(resolve)
            .catch(reject);
    });
}

require('./jsdoc-dts');

gulp.task('lint-dts', task);
