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
    const fsLib = require('./lib/fs');
    const logLib = require('./lib/log');
    const processLib = require('./lib/process');

    logLib.message('Generating ES5 code...');

    try {
        processLib.isRunning('scripts-es5', true);

        fsLib.deleteDirectory('js/', true);

        await processLib.exec('npx tsc --build ts/masters-es5');

        fsLib.deleteDirectory('js/Dashboards/', true);
        fsLib.deleteDirectory('js/DataGrid/', true);

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

        fsLib.deleteDirectory('code/es5/es-modules', true);

        logLib.success('Created ES5 code');
    } finally {
        processLib.isRunning('scripts-es5', false);
    }
}

gulp.task('scripts-es5', task);
