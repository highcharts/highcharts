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
 * Gulp task to run the building process of distribution files. By default it
 * builds all the distribution files. Usage: "gulp build".
 *
 * - `--file` Optional command line argument. Use to build a one or sevral
 *   files. Usage: "gulp build --file highcharts.js,modules/data.src.js"
 *
 * - `--force` Optional CLI argument to force a rebuild of scripts.
 *
 * @todo add --help command to inform about usage.
 *
 * @return {Promise<void>}
 * Promise to keep
 */
async function scriptsJS() {

    const argv = require('yargs').argv;
    const buildTool = require('../build');
    const fsLib = require('../libs/fs');
    const logLib = require('../libs/log');
    const processLib = require('../libs/process');

    const BuildScripts = buildTool.getBuildScripts({
        debug: (argv.d || argv.debug || false),
        files: (
            (argv.file) ?
                argv.file.split(',') :
                null
        ),
        type: (argv.type || null)
    });

    logLib.message('Generating code...');

    processLib.isRunning('scripts-js', true);

    try {
        // assemble JS files
        await BuildScripts.fnFirstBuild();

        // deleting invalid masters DTS
        fsLib
            .getFilePaths('js/masters/', true)
            .forEach(path => path.endsWith('.d.ts') && fsLib.deleteFile(path));

        // copy valid native DTS
        fsLib.copyAllFiles(
            'js/',
            'code/es-modules/',
            true
        );

        logLib.success('Created code');
    } finally {
        processLib.isRunning('scripts-js', false);
    }

}

gulp.task('scripts-js', scriptsJS);
