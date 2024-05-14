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
    const fsLib = require('../libs/fs');
    const processLib = require('../libs/process');
    const logLib = require('../libs/log');

    return new Promise((resolve, reject) => {

        logLib.message(`Linting TypeScript declarations (.d.ts) for ${argv.dashboards ? 'dashboards' : 'highcharts'} ...`);

        let directories = fsLib.getDirectoryPaths(TEST_FOLDER, false);

        directories = directories.filter(folder => {
            if (argv.dashboards) {
                return folder.includes('dashboards');
            }
            return !folder.includes('dashboards');
        });

        let promiseChain = Promise.resolve();

        directories.forEach(folder => {
            promiseChain = promiseChain.then(
                () => processLib.exec('npx tsc -p ' + folder)
            );
        });

        promiseChain
            .then(() => logLib.success('Finished linting'))
            .then(resolve)
            .catch(error => {
                if (argv.dashboards) {
                    logLib.failure('Linting failed, make sure you have built the Highcharts declarations first using "npx gulp dist"');
                }

                reject(error);
            });
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
