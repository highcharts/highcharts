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
 * @param  {object} argv
 *         Command line arguments
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function lintDTS(argv) {
    const fsLib = require('./lib/fs');
    const processLib = require('./lib/process');
    const logLib = require('./lib/log');

    return new Promise((resolve, reject) => {

        logLib.message(`Linting TypeScript declarations (.d.ts) for ${argv.dashboards ? 'dashboards' : 'highcharts'} ...`);

        let promiseChain = Promise.resolve();

        promiseChain = promiseChain.then(
            processLib.exec(
                'npx dtslint --localTs ../../node_modules/typescript/lib',
                {
                    cwd: path.join(process.cwd(), LINT_FOLDER)
                }
            )
        );

        let directories = fsLib.getDirectoryPaths(TEST_FOLDER, false);

        directories = directories.filter(folder => {
            if (argv.dashboards) {
                return folder.includes('dashboards');
            }
            return !folder.includes('dashboards');
        });

        directories.forEach(folder => {
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

lintDTS.description = 'Test TypeScript declarations in the code folder using tsconfig.json';
lintDTS.flags = {
    '--dashboards': 'Test only dashboards TypeScript declarations'
};
gulp.task('lint-dts', () => lintDTS(require('yargs').argv));

module.exports = {
    lintDTS
};
