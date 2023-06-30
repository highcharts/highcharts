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


const DTS_FILES = [
    'Core/Color/ColorString.d.ts',
    'Core/Renderer/CSSObject.d.ts',
    'Core/Renderer/DOMElementType.d.ts'
];


const DTS_FOLDERS = [
    'Dashboards/',
    'Data/',
    'DataGrid/'
];


/* *
 *
 *  Tasks
 *
 * */


/**
 * Copies additional DTS files, that were not created by TypeScript itself.
 *
 * @return {Promise<void>}
 * Promise to keep.
 */
async function scriptsDTS() {

    const fsLib = require('../lib/fs');
    const logLib = require('../lib/log');

    const {
        bundleTargetFolder,
        esModulesFolder
    } = require('./_config.json');

    for (const dtsFile of DTS_FILES) {
        fsLib.copyFile(
            path.join('ts', dtsFile),
            path.join(esModulesFolder, dtsFile)
        );
    }

    for (const dtsFolder of DTS_FOLDERS) {
        fsLib.copyAllFiles(
            path.join('ts', dtsFolder),
            path.join(esModulesFolder, dtsFolder),
            true,
            sourcePath => sourcePath.endsWith('.d.ts')
        );
    }

    logLib.success('Copied stand-alone DTS');

    fsLib.copyAllFiles(
        path.join(__dirname, 'scripts-dts/'),
        bundleTargetFolder,
        true
    );
    logLib.success('Created bundle DTS');

}


gulp.task('dashboards/scripts-dts', scriptsDTS);
