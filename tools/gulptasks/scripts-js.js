/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

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
 *         Promise to keep
 */
function task() {

    const Build = require('../build.js');
    const LogLib = require('./lib/log');

    return new Promise((resolve, reject) => {

        const argv = process.argv;
        const BuildScripts = Build.getBuildScripts({
            debug: (argv.d || argv.debug || false),
            files: (
                (argv.file) ?
                    argv.file.split(',') :
                    null
            ),
            type: (argv.type || null)
        });

        LogLib.message('Generating code...');

        BuildScripts
            .fnFirstBuild()
            .then(() => resolve())
            .catch(reject);

        LogLib.success('Created code');
    });
}

Gulp.task('scripts-js', task);
