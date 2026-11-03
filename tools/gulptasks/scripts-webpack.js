/*
 * Copyright (C) Highsoft AS
 */


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

    const logDirectory = await FSP.mkdtemp(Path.resolve('.webpack-log-'));
    const logFile = Path.join(logDirectory, 'webpack.log');
    const env = { ...process.env, HIGHCHARTS_WEBPACK_LOG_PATH: logFile };

    try {
        await FSP.rm('webpack.log', { force: true });

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
                        env,
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
                            env,
                            maxBuffer: 8 * 1024 * 1024,
                            silent: 0,
                            timeout: 60000
                        }
                    );
                } catch {
                    // Ignore: this run is only for interactive diagnostics.
                }

                if (log) {
                    await FSP.appendFile(logFile, log);
                }
                try {
                    await FSP.rename(logFile, 'webpack.log');
                } catch (publishError) {
                    if (publishError.code !== 'ENOENT') {
                        throw publishError;
                    }
                }

                throw error;
            }

        }

        await FSP.appendFile(logFile, log);
        await FSP.rename(logFile, 'webpack.log');

        LogLib.success('Finished packing.');
    } finally {
        await FSP.rm(logDirectory, { recursive: true, force: true });
    }
}

Gulp.task('scripts-webpack', scriptsWebpack);
