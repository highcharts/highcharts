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
function scriptsJS() {

    const argv = require('yargs').argv;
    const buildTool = require('../build');
    const fsLib = require('./lib/fs');
    const logLib = require('./lib/log');
    const processLib = require('./lib/process');

    return new Promise((resolve, reject) => {

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

        BuildScripts
            // assemble JS files
            .fnFirstBuild()
            // deleting invalid masters DTS
            .then(() => fsLib.getFilePaths('js/masters/', true).forEach(
                path => path.endsWith('.d.ts') && fsLib.deleteFile(path)
            ))
            // copy valid native DTS
            .then(() => fsLib.copyAllFiles(
                'js/',
                'code/es-modules/',
                true,
                sourcePath => sourcePath.endsWith('.d.ts')
            ))
            .then(() => logLib.success('Created code'))
            .then(function (output) {
                processLib.isRunning('scripts-js', false);
                resolve(output);
            })
            .catch(function (error) {
                processLib.isRunning('scripts-js', false);
                reject(error);
            });
    });
}

gulp.task('scripts-js', scriptsJS);
