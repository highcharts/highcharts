/*
 * Copyright (C) Highsoft AS
 */

const fs = require('node:fs/promises');
const gulp = require('gulp');
const path = require('node:path');

/* *
 *
 *  Tasks
 *
 * */

/**
 * Webpack task
 *
 * @return {Promise<void>}
 * Promise to keep
 */
async function scriptsWebpack() {

    const argv = require('yargs').argv;
    const fsLib = require('../libs/fs');
    const logLib = require('../libs/log');
    const processLib = require('../libs/process');

    logLib.message('Packing code...');

    try {

        const configs = [
            'highcharts.webpack.mjs'
        ].map(
            wp => path.join('tools', 'webpacks', wp)
        );

        let log = '';

        fsLib.copyAllFiles(
            'js/',
            'code/es-modules/',
            true
        );

        for (const config of configs) {
            if (argv.verbose) {
                logLib.warn(config);
            }
            log += await processLib.exec(
                `npx webpack -c ${config}`,
                {
                    silent: argv.verbose ? 1 : 2,
                    timeout: 60000
                }
            );
        }

        await fs.writeFile('webpack.log', log);

        logLib.success('Finished packing.');

    } catch (error) {

        logLib.failure('ERROR:', error);

    }

}

gulp.task('scripts-webpack', scriptsWebpack);
