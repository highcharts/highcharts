/*
 * Copyright (C) Highsoft AS
 */


const FSP = require('node:fs/promises');
const Gulp = require('gulp');
const Path = require('node:path');


/* *
 *
 *  Constants
 *
 * */


const HEADER_PATTERN = /\/\*\*[\s]+\*[\s]+@license.*?\*\//su;


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

    const Code = require('../code');
    const FSLib = require('../libs/fs');
    const LogLib = require('../libs/log');
    const ProcessLib = require('../libs/process');

    const argv = require('yargs').argv;

    LogLib.message('Packing code...');

    const configs = {
        Highcharts: 'highcharts.webpack.mjs'
    };

    let config;
    let fileContent;
    let fileMatch;
    let log = '';

    for (const productName of Object.keys(configs)) {
        config = Path.join('tools', 'webpacks', configs[productName]);

        if (argv.verbose) {
            LogLib.warn(config);
        }

        log += await ProcessLib.exec(
            `npx webpack -c ${config}`,
            {
                silent: argv.verbose ? 1 : 2,
                timeout: 60000
            }
        );

        for (const filePath of FSLib.getFilePaths('code', true)) {
            fileContent = await FSP.readFile(filePath, 'utf8');
            fileMatch = fileContent.match(HEADER_PATTERN);

            if (!fileMatch) {
                continue;
            }

            if (fileMatch.index > 80) {
                fileContent = fileMatch[0] + '\n' + fileContent;
            }

            fileContent = Code.processProductsTags(fileContent);

            await FSP.writeFile(filePath, fileContent, 'utf8');
        }

    }

    await FSP.writeFile('webpack.log', log);

    LogLib.success('Finished packing.');

}

Gulp.task('scripts-webpack', scriptsWebpack);
