/*
 * Copyright (C) Highsoft AS
 */


const FS = require('node:fs');
const FSP = require('node:fs/promises');
const Gulp = require('gulp');
const Path = require('node:path');

/* *
 *
 *  Tasks
 *
 * */


/**
 * Webpack task.
 *
 * @return {Promise<void>}
 * Promise to keep.
 */
async function scriptsWebpack() {

    const LogLib = require('../libs/log');
    const ProcessLib = require('../libs/process');

    const argv = require('yargs').argv;

    LogLib.message('Packing code...');

    let configs;
    if (argv.product === 'Grid') {
        configs = {
            Grid: 'grid.webpack.mjs'
        };
    } else if (argv.product === 'Dashboards') {
        configs = {
            Dashboards: 'dashboards.webpack.mjs'
        };
    } else {
        configs = {
            Highcharts: 'highcharts.webpack.mjs',
            HighchartsES5: 'highcharts-es5.webpack.mjs'
        };
    }

    if (FS.existsSync('webpack.log')) {
        await FSP.rm('webpack.log');
    }

    let config;
    let log = '';

    for (const productName of Object.keys(configs)) {
        config = Path.join('tools', 'webpacks', configs[productName]);
        const webpackCommand = `npx webpack -c ${config} --no-color`;

        if (argv.verbose) {
            LogLib.warn(config);
        }

        try {
            log += await ProcessLib.exec(
                webpackCommand,
                {
                    maxBuffer: 8 * 1024 * 1024,
                    silent: argv.verbose ? 1 : 2,
                    timeout: 60000
                }
            );
        } catch (error) {
            const stderr = (
                error &&
                typeof error.stderr === 'string' &&
                error.stderr.trim()
            ) ? error.stderr.trim() : '';
            const stdout = (
                error &&
                typeof error.stdout === 'string' &&
                error.stdout.trim()
            ) ? error.stdout.trim() : '';
            const detail = stderr || stdout;

            if (detail) {
                const detailLines = detail.split(/\r?\n/u);
                const maxLines = 200;
                const excerpt = detailLines.slice(-maxLines).join('\n');

                LogLib.failure(
                    `Webpack failed for ${productName} (${config}). ` +
                    `Showing last ${Math.min(detailLines.length, maxLines)} line(s):`
                );
                process.stderr.write(`${excerpt}\n`);
                log += `${stdout}${stdout && stderr ? '\n' : ''}${stderr}\n`;
            } else {
                LogLib.failure(
                    `Webpack failed for ${productName} (${config}), ` +
                    'but no compiler output was captured.'
                );
            }

            LogLib.warn(
                'Re-running failed webpack command with detailed diagnostics...'
            );

            try {
                await ProcessLib.exec(
                    (
                        `${webpackCommand} --bail ` +
                        '--stats errors-warnings'
                    ),
                    {
                        maxBuffer: 8 * 1024 * 1024,
                        silent: 0,
                        timeout: 60000
                    }
                );
            } catch {
                // Ignore: this run is only for interactive diagnostics.
            }

            if (log) {
                await FSP.writeFile('webpack.log', log, { flag: 'a' });
            }

            throw error;
        }

    }

    await FSP.writeFile('webpack.log', log, { flag: 'a' }); // 'a' - append

    LogLib.success('Finished packing.');
}

Gulp.task('scripts-webpack', scriptsWebpack);
