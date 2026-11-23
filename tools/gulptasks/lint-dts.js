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
const FOLDER_NAMES_WHITELIST = [
    'classes',
    'dashboards',
    'es-modules',
    'grid',
    'highcharts',
    'highcharts-3d',
    'highcharts-gantt',
    'highcharts-more',
    'highmaps',
    'highstock',
    'indicators',
    'modules',
    'samples',
    'themes'
];

function isAllowedTestFolder(folder) {
    const name = path.basename(folder);
    return FOLDER_NAMES_WHITELIST.includes(name) &&
        path.resolve(folder) === path.resolve(TEST_FOLDER, name);
}

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
    const logLib = require('../libs/log');
    const processLib = require('../libs/process');
    const product = argv.product || 'Highcharts';

    return new Promise((resolve, reject) => {

        logLib.message(`Linting TypeScript declarations (.d.ts) for ${product} ...`);

        let directories = fsLib.getDirectoryPaths(TEST_FOLDER, false);

        // Check if all directories are in the whitelist
        const disallowedDirectories = directories.filter(
            folder => !isAllowedTestFolder(folder)
        );

        if (disallowedDirectories.length > 0) {
            logLib.failure(
                'Some directories are not in the whitelist:',
                disallowedDirectories.join(', ')
            );
            reject(new Error(
                'Some directories are not in the whitelist: ' +
                disallowedDirectories.join(', ')
            ));
            return;
        }

        if (product === 'Highcharts') {
            directories = directories.filter(folder => !(
                folder.includes('dashboards') ||
                folder.includes('grid')
            ));
        } else if (product === 'Grid') {
            directories = [path.join(TEST_FOLDER, 'grid')];
        } else if (product === 'Dashboards') {
            directories = [path.join(TEST_FOLDER, 'dashboards')];
        }

        let promiseChain = Promise.resolve();

        // Run tsc via Node directly (no shell / npx) so folder paths stay
        // literal arguments and Windows avoids DEP0190.
        directories.forEach(folder => {
            promiseChain = promiseChain.then(
                () => processLib.execFile(process.execPath, [
                    require.resolve('typescript/bin/tsc'), '-p', folder
                ])
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
    '--product': 'Test project TypeScript declarations only: Highcharts (default), Grid, Dashboards'
};
gulp.task('lint-dts', () => lintDTS(require('yargs').argv));

module.exports = {
    lintDTS,
    isAllowedTestFolder,
    FOLDER_NAMES_WHITELIST,
    TEST_FOLDER
};
