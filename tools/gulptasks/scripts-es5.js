/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Tasks
 *
 * */

/**
 * Gulp task to run the building process of distribution js files for "older"
 * browsers. By default it builds the js distribution files (without DTS) into
 * the ./code/es5 folder.
 *
 * @todo add --help command to inform about usage.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
async function task() {
    const argv = require('yargs').argv;
    const buildTool = require('../build');
    const fsLib = require('../libs/fs');
    const logLib = require('../libs/log');
    const processLib = require('../libs/process');

    logLib.message('Generating ES5 code...');

    try {
        processLib.isRunning('scripts-es5', true);

        fsLib.deleteDirectory('js/');

        await processLib.exec('npx tsc -p ts/masters-es5 --outDir js/');

        fsLib.deleteDirectory('js/Dashboards/');
        fsLib.deleteDirectory('js/DataGrid/');

        await buildTool
            .getBuildScripts({
                debug: (argv.d || argv.debug || false),
                files: (
                    (argv.file) ?
                        argv.file.split(',') :
                        null
                ),
                type: (argv.type || null),
                output: 'code/es5/'
            })
            .fnFirstBuild();

        await buildTool
            .getBuildScripts({
                base: 'js/masters-es5/',
                debug: (argv.d || argv.debug || false),
                files: (
                    (argv.file) ?
                        argv.file.split(',') :
                        null
                ),
                type: (argv.type || null),
                output: 'code/es5/'
            })
            .fnFirstBuild();

        fsLib.deleteDirectory('code/es5/es-modules');

        logLib.success('Created ES5 code');
    } finally {
        processLib.isRunning('scripts-es5', false);
    }
}

gulp.task('scripts-es5', task);
