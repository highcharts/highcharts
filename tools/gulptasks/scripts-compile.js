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
 * @return {Promise}
 * Promise to keep
 */
function scriptsCompile(filePathes) {
    const fs = require('fs'),
        fsLib = require('./lib/fs'),
        logLib = require('./lib/log'),
        path = require('path'),
        processLib = require('./lib/process'),
        swc = require('@swc/core'),
        argv = require('yargs').argv;

    filePathes = filePathes instanceof Array ?
        filePathes :
        typeof argv.files === 'string' ?
            argv.files.split(',').map(filePath => path.join('code', filePath)) :
            fsLib.getFilePaths('code', true);

    let promiseChain1 = Promise.resolve(),
        promiseChain2 = Promise.resolve();

    for (
        let i = 0,
            iEnd = filePathes.length,
            inputPath,
            promise;
        i < iEnd;
        ++i
    ) {
        inputPath = filePathes[i];

        if (
            inputPath.includes('/dashboards/') ||
            inputPath.includes('/es-modules/') ||
            !inputPath.endsWith('.src.js')
        ) {
            continue;
        }


        const target = (
                argv.target ||
                inputPath.includes('/es5/') ?
                    'ECMASCRIPT5_STRICT' :
                    'ECMASCRIPT_2020'
            ),
            outputPath = inputPath.replace('.src.js', '.js'),
            outputMapPath = outputPath + '.map';

        // Compile file, https://swc.rs/docs/usage/core
        const code = fs.readFileSync(inputPath, 'utf-8');
        promise = swc.minify(code, {
            compress: {
                // hoist_funs: true
            },
            mangle: true,
            sourceMap: true
        })

            .then(result => {
                // Write compiled file
                fs.writeFileSync(
                    outputPath,
                    result.code.replace('@license ', '') +
                    `//# sourceMappingURL=${path.basename(outputMapPath)}`
                );

                // Write source map
                fs.writeFileSync(outputMapPath, result.map);

                logLib.success(
                    `Compiled ${inputPath} => ${outputPath}`,
                    `(${(fs.statSync(outputPath).size / 1024).toFixed(2)} kB)`
                );

                return result;
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
