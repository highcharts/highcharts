/*
 * Copyright (C) Highsoft AS
 */

/* *
 *
 *  Imports
 *
 * */

const gulp = require('gulp');

/* *
 *
 *  Tasks
 *
 * */

/**
 * Removes Highcharts files from the `js` folder.
 */
function removeHighcharts() {
    const fsLib = require('../libs/fs');

    fsLib.deleteDirectory('js/Core/Axis/', true);
    fsLib.deleteDirectory('js/Core/Legend/', true);
    fsLib.deleteDirectory('js/Core/Renderer/SVG/', true);
    fsLib.deleteDirectory('js/Core/Series/', true);
    fsLib.deleteDirectory('js/Extensions/', true);
    fsLib.deleteDirectory('js/Gantt/', true);
    fsLib.deleteDirectory('js/Maps/', true);
    fsLib.deleteDirectory('js/Series/', true);
    fsLib.deleteDirectory('js/Stock/', true);
    fsLib.deleteDirectory('js/masters', true);
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
 * @param {string} version
 * Version string to replace with.
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
    const {
        bundleTargetFolder,
        typeScriptFolder,
        typeScriptFolderDatagrid
    } = require('./dashboards/_config.json');

    try {
        let library = 'Highcharts';

        if (argv.dashboards) {
            library = 'Dashboards';
        } else if (argv.datagrid) {
            library = 'DataGrid';
        }
        logLib.message(`Generating files for ${library}...`);

        processLib.isRunning('scripts-ts', true);

        if (argv.dashboards) {
            fsLib.deleteDirectory(bundleTargetFolder, true);
            // fsLib.deleteDirectory(fsLib.path('code/datagrid'), true);
        }

        fsLib.deleteDirectory('js', true);

        fsLib.copyAllFiles(
            'ts',
            argv.assembler ? 'js' : fsLib.path(['code', 'es-modules']),
            true,
            sourcePath => sourcePath.endsWith('.d.ts')
        );

        if (argv.dashboards) {
            await processLib
                .exec(`npx tsc -p ${typeScriptFolder} --outDir js`);
        } else if (argv.datagrid) {
            await processLib
                .exec(`npx tsc -p ${typeScriptFolderDatagrid} --outDir js`);
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
                if (
                    file.includes('dashboards') ||
                    file.includes('datagrid')
                ) {
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

            // Remove DataGrid
            fsLib.deleteDirectory(fsLib.path(['js', 'datagrid']), true);
            fsLib.deleteDirectory(fsLib.path(['js', 'DataGrid']), true);

            // Fix masters
            fs.renameSync(
                fsLib.path(['js', 'masters-dashboards']),
                fsLib.path(['js', 'masters'])
            );
        } else if (argv.datagrid) {
            removeHighcharts();

            // Fix masters
            fs.renameSync(
                fsLib.path(['js', 'masters-datagrid']),
                fsLib.path(['js', 'masters'])
            );
        } else {
            // Remove Dashboards
            fsLib.deleteDirectory(fsLib.path(['js', 'Dashboards']), true);
            fsLib.deleteDirectory(fsLib.path(['js', 'DataGrid']), true);
        }

        processLib.isRunning('scripts-ts', false);
    } finally {
        processLib.isRunning('scripts-ts', false);
    }
}

scriptsTS.description = 'Builds files of `/ts` folder into `/js` folder.';
scriptsTS.flags = {
    '--dashboards': 'Build dashboards files only',
    '--datagrid': 'Build datagrid files only'
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
