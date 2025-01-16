/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

async function gridScripts() {
    const argv = require('yargs').argv;
    const buildTool = require('../../build');
    const fsLib = require('../../libs/fs');
    const logLib = require('../../libs/log');
    const processLib = require('../../libs/process');

    const {
        bundleTargetFolder,
        esModulesFolder
    } = require('./_config.json');

    try {
        const { release } = argv;

        // Assemble bundle
        await buildTool
            .getBuildScripts({
                base: 'js/masters/',
                debug: (argv.debug || false),
                files: (
                    (argv.file) ?
                        argv.file.split(',') :
                        null
                ),
                namespace: 'Grid',
                product: 'Grid',
                output: bundleTargetFolder,
                version: (release || ''),
                assetPrefix: release ?
                    `https://code.highcharts.com/grid/${release}` :
                    '/code/grid'
            })
            .fnFirstBuild();

        // Copy valid native DTS
        fsLib.copyAllFiles(
            'js/',
            esModulesFolder,
            true,
            sourcePath => sourcePath.endsWith('.d.ts')
        );

        logLib.success('Created Grid code');
    } finally {
        processLib.isRunning('scripts-grid', false);
    }
}

const { scriptsTS } = require('../scripts-ts');
// const { scriptCSS } = require('../scripts-css');
require('./scripts-dts');

gulp.task('grid/scripts', gulp.series(
    () => scriptsTS({ grid: true }),
    gridScripts,
    // () => scriptCSS({ grid: true }),
    'grid/scripts-dts'
));
