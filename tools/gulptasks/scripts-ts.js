/*
 * Copyright (C) Highsoft AS
 */

/* *
 *
 *  Imports
 *
 * */

const gulp = require('gulp');
const path = require('path');
const FS = require('node:fs');

/* *
 *
 *  Constants
 *
 * */

// Exclude list to filter out original DTS files from other product sources.
const HIGHCHARTS_DTS_COPY_EXCLUDES = [
    'Dashboards',
    'Data',
    'Grid'
].map(p => path.join('ts', p));

/* *
 *
 *  Tasks
 *
 * */

/**
 * Removes Highcharts files from the `js` folder.
 *
 * @param {boolean} removeFromCode
 * Whether to remove files from the `code` folder (for Grid and Dashboards).
 * @param {string} product
 * Product name to determine correct path (Grid or Dashboards).
 */
function removeHighcharts(removeFromCode = false, product = 'Highcharts') {
    const fsLib = require('../libs/fs');
    let folder;

    if (!removeFromCode) {
        folder = ['js'];
    } else if (product === 'Grid') {
        folder = ['code', 'grid', 'es-modules'];
    } else if (product === 'Dashboards') {
        folder = ['code', 'dashboards', 'es-modules'];
    } else {
        folder = ['js']; // fallback
    }

    const pathsToDelete = [
        [...folder, 'Core', 'Axis'],
        [...folder, 'Core', 'Legend'],
        [...folder, 'Core', 'Renderer', 'SVG'],
        [...folder, 'Core', 'Series'],
        [...folder, 'Extensions'],
        [...folder, 'Gantt'],
        [...folder, 'Maps'],
        [...folder, 'Series'],
        [...folder, 'Stock'],
        [...folder, 'masters']
    ];

    // Remove Grid from Dashboards
    if (product === 'Dashboards') {
        pathsToDelete.push([...folder, 'Grid']);
    }

    for (const pathToDelete of pathsToDelete) {
        fsLib.deleteDirectory(fsLib.path(pathToDelete));
    }
}

/**
 * Replaces product placeholders with date and given data.
 *
 * @param {string} fileOrFolder
 * File or folder of files to replace in. (recursive)
 *
 * @param {string} productName
 * Official product name to replace with.
 *
 * @param {string} productVersion
 * Product version string to replace with.
 *
 * @param {Date} productDate
 * Product date to replace with.
 *
 * @return {Promise<void>}
 * Promise to keep.
 */
async function replaceProductPlaceholders(
    fileOrFolder,
    productName,
    productVersion,
    productDate = new Date()
) {
    const fsp = require('node:fs/promises');
    const fsLib = require('../libs/fs');

    if (fsLib.isFile(fileOrFolder)) {
        const fileContent = await fsp.readFile(fileOrFolder, 'utf8');

        if (!fileContent.includes('@product.')) {
            return;
        }

        await fsp.writeFile(fileOrFolder, fileContent.replace(
            /@product\.(\w+)@/gsu,
            (match, group1) => {
                switch (group1) {
                    case 'assetPrefix':
                        return 'dashboards';
                    case 'date':
                        return productDate.toISOString().substring(0, 10);
                    case 'name':
                        return productName;
                    case 'version':
                        return productVersion;
                    default:
                        return match;
                }
            }
        ), 'utf8');
    }

    if (fsLib.isDirectory(fileOrFolder)) {
        for (const file of fsLib.getFilePaths(fileOrFolder)) {
            if (file.endsWith('.src.js')) {
                await replaceProductPlaceholders(
                    file,
                    productName,
                    productVersion,
                    productDate
                );
            }
        }
    }

}

/**
 * Builds files of `/ts` folder into `/js` folder.
 *
 * @param  {object} argv
 *         Command line arguments
 *
 * @return {Promise}
 *         Promise to keep.
 */
async function scriptsTS(argv) {
    const fs = require('node:fs');
    const fsLib = require('../libs/fs');
    const logLib = require('../libs/log');
    const processLib = require('../libs/process');

    try {
        const product = argv.product || 'Highcharts';

        logLib.message(`Generating files for ${product}...`);

        processLib.isRunning('scripts-ts', true);


        fsLib.deleteDirectory('js');

        if (product === 'Dashboards') {
            const bundleDtsFolder = path.join(__dirname, 'scripts-dts/dashboards/');
            const codeDashboardsFolder = 'code/dashboards/';

            fsLib.copyAllFiles(
                bundleDtsFolder,
                codeDashboardsFolder,
                true
            );

            fsLib.copyFile(
                codeDashboardsFolder + 'dashboards.src.d.ts',
                codeDashboardsFolder + 'dashboards.d.ts'
            );

            logLib.success('Copied stand-alone DTS for Dashboards');
        }

        if (product !== 'Grid') {
            fsLib.copyAllFiles(
                'ts',
                argv.assembler ? 'js' : fsLib.path(['code', 'es-modules']),
                true,
                sourcePath => (
                    sourcePath.endsWith('.d.ts') &&
                    !HIGHCHARTS_DTS_COPY_EXCLUDES
                        .some(p => sourcePath.startsWith(p))
                )
            );
        }

        if (product === 'Dashboards') {
            await processLib
                .exec(`npx tsc -p ${fsLib.path(['ts', 'masters-dashboards'])}`);
            removeHighcharts(true, product);
            // Copy Dashboards DTS files to dashboards es-modules
            [
                'Data',
                'Shared'
            ].forEach(dtsFolder => {
                fsLib.copyAllFiles(
                    fsLib.path(['ts', dtsFolder]),
                    fsLib.path(['code', 'dashboards', 'es-modules', dtsFolder]),
                    true,
                    sourcePath => sourcePath.endsWith('.d.ts')
                );
            });

            // Rename masters-dashboards to masters for Dashboards
            const dashboardsMastersPath = fsLib.path(['code', 'dashboards', 'es-modules', 'masters']);
            if (fs.existsSync(dashboardsMastersPath)) {
                // Ensure destination does not exist to avoid ENOTEMPTY on rename
                fsLib.deleteDirectory(dashboardsMastersPath);
            }
            if (fs.existsSync(fsLib.path(['code', 'dashboards', 'es-modules', 'masters-dashboards']))) {
                fs.renameSync(
                    fsLib.path(['code', 'dashboards', 'es-modules', 'masters-dashboards']),
                    dashboardsMastersPath
                );
            }

            const dashboardsBuildPropertiesJSON =
                fsLib.getFile(fsLib.path(['tools', 'gulptasks', 'dashboards', 'build-properties.json']), true);
            const dashboardsEsmFiles =
                fsLib.getFilePaths(fsLib.path(['code', 'dashboards', 'es-modules']), true);

            for (const file of dashboardsEsmFiles) {
                await replaceProductPlaceholders(
                    file,
                    'Dashboards',
                    dashboardsBuildPropertiesJSON.version
                );
            }

            logLib.success('Completed Dashboards TypeScript compilation');
        } else if (product === 'Grid') {
            await processLib
                .exec(`npx tsc -p ${fsLib.path(['ts', 'masters-grid'])}`);
            removeHighcharts(true, product);

            [ // Copy dts files from the folders to the grid es-modules:
                'Data',
                'Grid',
                'Shared'
            ].forEach(dtsFolder => {
                fsLib.copyAllFiles(
                    fsLib.path(['ts', dtsFolder]),
                    fsLib.path(['code', 'grid', 'es-modules', dtsFolder]),
                    true,
                    sourcePath => sourcePath.endsWith('.d.ts')
                );
            });

            FS.renameSync(
                fsLib.path(['code', 'grid', 'es-modules', 'masters-grid']),
                fsLib.path(['code', 'grid', 'es-modules', 'masters'])
            );

            [ // Copy the master dts files to the umd bundles folder
                'grid-lite.src.d.ts',
                'grid-pro.src.d.ts'
            ].forEach(dtsFile => {
                const sourcePath = fsLib.path([
                    'code',
                    'grid',
                    'es-modules',
                    'masters',
                    dtsFile
                ]);
                const destinationPath = fsLib.path([
                    'code',
                    'grid',
                    dtsFile
                ]);

                // Update relative paths from '../' to './es-modules/'
                if (FS.existsSync(sourcePath)) {
                    const content = FS.readFileSync(sourcePath, 'utf8')
                        .replace(/\.\.\//gu, './es-modules/');

                    FS.writeFileSync(destinationPath, content, 'utf8');
                }

                // Copy the copied file to the same destination but with a
                // .d.ts extension instead of .src.d.ts
                FS.copyFileSync(
                    destinationPath,
                    destinationPath.replace(/\.src\.d\.ts$/u, '.d.ts')
                );
            });

            const gridBuildPropertiesJSON =
                fsLib.getFile(fsLib.path(['tools', 'gulptasks', 'grid', 'build-properties.json']), true);
            const gridFiles =
                fsLib.getFilePaths(fsLib.path(['code', 'grid']), true);

            for (const file of gridFiles) {
                await replaceProductPlaceholders(
                    file,
                    'Grid',
                    gridBuildPropertiesJSON.version
                );
            }
        } else if (argv.assembler) {
            await processLib
                .exec('npx tsc -p ts --outDir js');
        } else {
            await processLib
                .exec('npx tsc -p ts');
            await processLib
                .exec('npx tsc -p ' + fsLib.path(['ts', 'masters-es5']));

            const buildPropertiesJSON =
                fsLib.getFile('build-properties.json', true);
            const packageJSON =
                fsLib.getFile('package.json', true);
            const esmFiles =
                fsLib.getFilePaths(fsLib.path(['code', 'es-modules']), true);

            for (const file of esmFiles) {
                await replaceProductPlaceholders(
                    file,
                    'Highcharts',
                    (
                        argv.release ||
                        buildPropertiesJSON.version ||
                        packageJSON.version
                    )
                );
            }
        }

        if (product === 'Dashboards') {
            removeHighcharts();
            // Copy ambient Dashboards DTS that are not emitted by tsc
            // (e.g. ComponentType.d.ts, TextOptions.d.ts, JSON.d.ts etc.)
            fsLib.copyAllFiles(
                fsLib.path(['ts', 'Dashboards']),
                fsLib.path(['code', 'dashboards', 'es-modules', 'Dashboards']),
                true,
                sourcePath => sourcePath.endsWith('.d.ts')
            );
        } else {
            // Remove Dashboards
            fsLib.deleteDirectory(fsLib.path(['js', 'Dashboards']));

            // Remove Grid
            fsLib.deleteDirectory(fsLib.path(['js', 'Grid']));
        }

        processLib.isRunning('scripts-ts', false);
    } finally {
        processLib.isRunning('scripts-ts', false);
    }
}

scriptsTS.description = 'Builds files of `/ts` folder into `/js` folder.';
scriptsTS.flags = {
    '--dashboards': 'Build dashboards files only',
    '--product': 'The project to build: Highcharts (default), Grid, Dashboards'
};
gulp.task(
    'scripts-ts',
    gulp.series(
        'scripts-messages',
        () => scriptsTS(require('yargs').argv)
    )
);

module.exports = {
    scriptsTS
};
