/*
 * Copyright (C) Highsoft AS
 */


const fs = require('node:fs/promises');
const gulp = require('gulp');
const path = require('node:path');


/* *
 *
 *  Constants
 *
 * */


const HELPME = `
Highcharts Dashboards - Dist Examples Task
==========================================

No options available. Just run it.

Outdated:
Requires demo.path to be set in git-ignore-me.properties. This should be set to the output folder of the highcharts-demo-manager frontend. Example: '../highcharts-demo-manager/frontend/tmp/';

Resources:
* https://github.com/highcharts/highcharts-demo-manager/tree/master/frontend (internal)
`;

/* *
 *
 *  Functions
 *
 * */


async function cleanupExampleDir(examplesDir) {
    const filesToClean = [
        'demo.html',
        'demo.details',
        'test-notes.md'
    ];

    for (const fileName of filesToClean) {
        await fs.rm(
            path.join(examplesDir, fileName),
            { force: true }
        );
    }
}


async function transformExampleDir(examplesDir) {

    const files = [
        'demo.css',
        'demo.js',
        'demo.html'
    ];

    for (const fileName of files) {
        let filePath = path.join(examplesDir, fileName);
        const contents = await fs.readFile(filePath, 'utf-8');

        let newContent = contents
            .replaceAll('https://code.highcharts.com/dashboards/', '../../code/')
            .replaceAll('https://code.highcharts.com/datagrid/', '../../code/')
            .replaceAll(/(?<!\.src)\.js(?!on)/gmu, '.src.js');

        if (fileName === 'demo.html') {
            filePath = filePath.replace('demo.html', 'index.html');
            newContent = [
                '<!DOCTYPE HTML>',
                '<html>',
                '<head>',
                '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />',
                '<meta name="viewport" content="width=device-width, initial-scale=1" />',
                '<link rel="stylesheet" type="text/css" href="./demo.css">',
                '</head>',
                '<body>',
                newContent,
                '<script src="./demo.js"></script>',
                '</body>',
                '</html>'
            ].join('\n');
        }

        await fs.writeFile(
            filePath,
            newContent
        );
    }
}


/* *
 *
 *  Tasks
 *
 * */


/**
 * Copies and transforms Dashboards demos as distribution examples.
 *
 * @return {Promise<void>}
 * Promise to keep.
 */
async function dashboardsDistExamples() {
    const fsLib = require('../lib/fs');

    const {
        helpme
    } = require('yargs').argv;

    if (helpme) {
        /* eslint-disable-next-line no-console */
        console.log(HELPME);
        return;
    }

    const {
        buildFolder,
        examplesFolder,
        product
    } = require('./_config.json');

    const demoPaths = fsLib.getDirectoryPaths(examplesFolder, true).reverse();

    const output = [
        `<h1>${product} examples</h1>`,
        '<ul>'
    ];

    for (const demoPath of demoPaths) {
        const relativePath = path.relative(examplesFolder, demoPath);
        const demoName = (await fs.readFile(
            path.join(demoPath, 'demo.details'),
            'utf-8'
        )).match(/^name:\s*(.*)$/mu)[1];

        output.push(
            '<li>',
            `<a href="./examples/${relativePath}/index.html">${demoName}</a>`,
            '</li>'
        );

        const targetPath = path.join(buildFolder, 'examples', relativePath);

        await fsLib.copyAllFiles(demoPath, targetPath, true);
        await transformExampleDir(targetPath);
        await cleanupExampleDir(targetPath);

    }

    output.push('</ul>');

    await fs.writeFile(
        path.join(buildFolder, 'index.html'),
        output.join('\n')
    );

}


gulp.task('dashboards/dist-examples', dashboardsDistExamples);
