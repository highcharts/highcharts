/*
 * Copyright (C) Highsoft AS
 */


const fs = require('fs');
const fsLib = require('../lib/fs');
const gulp = require('gulp');
const path = require('path');


/* *
 *
 *  Constants
 *
 * */


const DTS_FILES = [
    'Core/Color/ColorString.d.ts',
    'Core/Color/ColorType.d.ts',
    'Core/Color/GradientColor.d.ts',
    'Core/Renderer/AlignObject.d.ts',
    'Core/Renderer/CSSObject.d.ts',
    'Core/Renderer/DashStyleValue.d.ts',
    'Core/Renderer/DOMElementType.d.ts',
    'Core/Renderer/HTML/HTMLAttributes.d.ts',
    'Core/Renderer/SVG/SVGAttributes.d.ts',
    'Core/Renderer/SVG/SVGPath.d.ts'
].map(fsLib.path);


const DTS_FOLDERS = [
    'Dashboards/',
    'Data/',
    'DataGrid/'
].map(fsLib.path);


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

    const bundleDtsFolder = path.join(__dirname, 'scripts-dts/');

    fsLib.copyAllFiles(bundleDtsFolder, bundleTargetFolder, true);

    const bundleDtsFiles = fsLib.getFilePaths(bundleDtsFolder, true);

    for (const bundleDtsFile of bundleDtsFiles) {
        fs.writeFileSync(
            path.join(
                bundleTargetFolder,
                path
                    .relative(bundleDtsFolder, bundleDtsFile)
                    .replace(/\.src\.d\.ts$/u, '.d.ts')
            ),
            fs.readFileSync(bundleDtsFile, 'utf8').replace(/\.src"/gu, '"')
        );
    }

    logLib.success('Created bundle DTS');

}


gulp.task('dashboards/scripts-dts', scriptsDTS);
