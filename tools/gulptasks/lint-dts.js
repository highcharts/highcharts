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
    const product = argv.product || (
        argv.dashboards ? 'Dashboards' : 'Highcharts'
    );

    return new Promise((resolve, reject) => {

        logLib.message(`Linting TypeScript declarations (.d.ts) for ${product} ...`);

        let directories = fsLib.getDirectoryPaths(TEST_FOLDER, false);

        directories = directories.filter(folder => {
            switch (product) {
                case 'Dashboards':
                    return folder.includes('dashboards');
                case 'Highcharts':
                    return !(
                        folder.includes('dashboards') ||
                        folder.includes('grid')
                    );
                case 'Grid':
                    // TODO: Implement grid dts linting
                    return false;
                default:
                    return false;
            }
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
                if (product === 'Dashboards') {
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
