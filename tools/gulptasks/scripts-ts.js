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
 *  Tasks
 *
 * */

/**
 * Removes Highcharts files from the `js` folder.
 *
 * @param {boolean} removeFromCode
 * Whether to remove files from the `code` folder (only for Grid).
 */
function removeHighcharts(removeFromCode = false) {
    const fsLib = require('../libs/fs');
    const folder = removeFromCode ? ['code', 'grid', 'es-modules'] : ['js'];

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
    const dashCfg = require('./dashboards/_config.json');

    try {
        const product = argv.product || 'Highcharts';

        logLib.message(`Generating files for ${product}...`);

        processLib.isRunning('scripts-ts', true);

        if (argv.dashboards) {
            fsLib.deleteDirectory(dashCfg.bundleTargetFolder);
        }

        fsLib.deleteDirectory('js');

        if (product === 'Grid') {
            const bundleDtsFolder = path.join(__dirname, 'scripts-dts/');
            const codeGridFolder = 'code/grid/';

            fsLib.copyAllFiles(
                bundleDtsFolder,
                codeGridFolder,
                true
            );

            fsLib.copyFile(
                codeGridFolder + 'grid-lite.src.d.ts',
                codeGridFolder + 'grid-lite.d.ts'
            );

            fsLib.copyFile(
                codeGridFolder + 'grid-pro.src.d.ts',
                codeGridFolder + 'grid-pro.d.ts'
            );

            logLib.success('Copied stand-alone DTS for Grid');

        } else {
            fsLib.copyAllFiles(
                'ts',
                argv.assembler ? 'js' : fsLib.path(['code', 'es-modules']),
                true,
                sourcePath => sourcePath.endsWith('.d.ts')
            );
        }

        if (argv.dashboards) {
            await processLib
                .exec(`npx tsc -p ${dashCfg.typeScriptFolder} --outDir js`);
        } else if (product === 'Grid') {
            await processLib
                .exec(`npx tsc -p ${fsLib.path(['ts', 'masters-grid'])}`);
            removeHighcharts(true);

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
                if (file.includes('dashboards')) {
                    continue;
                }
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

        if (argv.dashboards) {
            removeHighcharts();

            // Remove Grid
            fsLib.deleteDirectory(fsLib.path(['js', 'Grid']));

            // Fix masters
            fs.renameSync(
                fsLib.path(['js', 'masters-dashboards']),
                fsLib.path(['js', 'masters'])
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
    '--product': 'The project to build: Highcharts (default), Grid'
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
