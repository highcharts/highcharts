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

const TEST_FOLDER = path.join('test', 'typescript-dts');

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

        let promiseChain = Promise.resolve();

        promiseChain = promiseChain.then(
            processLib.exec(
                'npx dtslint --localTs ../../node_modules/typescript/lib',
                {
                    cwd: path.join(process.cwd(), LINT_FOLDER)
                }
            )
        );

        fsLib
            .getDirectoryPaths(TEST_FOLDER, false)
            .filter(folder => !folder.includes('dashboards'))
            .forEach(folder => {
                promiseChain = promiseChain.then(
                    () => processLib.exec('npx tsc -p ' + folder)
                );
            });

        promiseChain
            .then(() => logLib.success('Finished linting'))
            .then(resolve)
            .catch(reject);
    });
}

require('./jsdoc-dts');

gulp.task('lint-dts', task);
