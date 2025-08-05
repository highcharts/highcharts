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
 * Creates minified versions of `.src.js` bundles in `/code` folder.
 *
 * @param {Array<string>} [filePaths]
 * Optional list of files to compile.
 *
 * @param {object} [config]
 * Configuration object.
 *
 * @param {string} [product]
 * Product name.
 *
 * @return {Promise}
 * Promise to keep
 */
function scriptsCompile(filePaths, config = {}, product = 'highcharts') {
    const fs = require('fs'),
        fsLib = require('../libs/fs'),
        logLib = require('../libs/log'),
        swc = require('@swc/core'),
        argv = require('yargs').argv;
    let esModulesFolder,
        targetFolder;

    if (argv.product === 'Grid') {
        esModulesFolder = fsLib.path(['code', 'grid', 'es-modules']);
        targetFolder = fsLib.path(['code', 'grid']);
    } else if (argv.product === 'Dashboards') {
        const dashCfg = require('./scripts-dts/dashboards/_config.json');
        esModulesFolder = dashCfg.esModulesFolder;
        targetFolder = dashCfg.bundleTargetFolder;
    } else if (product === 'highcharts') {
        esModulesFolder = '/es-modules/';
        targetFolder = 'code';
    } else if (product === 'dashboards') {
        esModulesFolder = config.esModulesFolder;
        targetFolder = config.bundleTargetFolder;
    }


    filePaths = filePaths instanceof Array ?
        filePaths :
        typeof argv.files === 'string' ?
            argv.files
                .split(',')
                .map(filePath => fsLib.path([targetFolder, filePath], true)) :
            fsLib
                .getFilePaths(targetFolder, true)
                .map(filePath => fsLib.path(filePath, true));

    let promiseChain1 = Promise.resolve(),
        promiseChain2 = Promise.resolve();

    for (
        let i = 0,
            iEnd = filePaths.length,
            inputPath,
            promise;
        i < iEnd;
        ++i
    ) {
        inputPath = filePaths[i];

        if (
            inputPath.includes(esModulesFolder) ||
            !inputPath.endsWith('.src.js')
        ) {
            continue;
        }

        const outputPath = inputPath.replace('.src.js', '.js'),
            outputMapPath = outputPath + '.map';

        // Compile file, https://swc.rs/docs/usage/core
        const code = fs.readFileSync(inputPath, 'utf-8');
        const isModule = inputPath.includes('/esm/');

        promise = swc
            .minify(code, {
                compress: {
                    // conditionals: false
                    // hoist_funs: true
                },
                format: {
                    comments: 'some'
                },
                mangle: true,
                module: isModule,
                sourceMap: true
            })
            .then(result => {
                // Write compiled file
                fs.writeFileSync(
                    outputPath,
                    result.code
                        .replace('@license ', '')
                        .replace(/\.src\.js\b/gsu, '.js')
                );

                // Write source map
                fs.writeFileSync(
                    outputMapPath,
                    result.map
                        .replace(/\.src\.js\b/gsu, '.js')
                );

                logLib.success(
                    `Compiled ${inputPath} => ${outputPath}`,
                    `(${(fs.statSync(outputPath).size / 1024).toFixed(2)} kB)`
                );

                return result;
            })
            .catch(error => {
                logLib.failure('ERROR:', inputPath, '=>', outputPath);
                throw error;
            });

        if (i % 2 || argv.CI) {
            promiseChain1 = promiseChain1.then(() => promise);
        } else {
            promiseChain2 = promiseChain2.then(() => promise);
        }
    }

    // not too many in parallel because of IO
    return Promise.all([
        promiseChain1,
        promiseChain2
    ]);
}

gulp.task('scripts-compile', scriptsCompile);

module.exports = scriptsCompile;
