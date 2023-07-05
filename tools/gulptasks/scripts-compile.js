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
                    'ECMASCRIPT6_STRICT'
            ),
            outputPath = inputPath.replace('.src.js', '.js'),
            outputMapPath = outputPath + '.map';

        // Compile file
        // See https://github.com/google/closure-compiler/wiki/Flags-and-Options
        promise = processLib.exec(
            'npx google-closure-compiler' +
            ' --assume_function_wrapper' +
            ' --compilation_level SIMPLE' +
            ` --create_source_map "${outputMapPath}"` +
            // ' --emit_use_strict' + // not supported in GCC 2022
            ' --env CUSTOM' +
            ` --js "${inputPath}"` +
            ` --js_output_file "${outputPath}"` +
            ` --language_in ${target}` +
            ` --language_out ${target}`,
            // ' --platform native', // use native compiler // not GCC 2022
            { silent: 2 }

        // Fix source map reference
        ).then(result => {
            const outputMapFileName = path.basename(outputMapPath);

            // Still no option for it
            fs.appendFileSync(
                outputPath,
                `//# sourceMappingURL=${outputMapFileName}`
            );

            logLib.success(
                `Compiled ${inputPath} => ${outputPath}`,
                `(${(fs.statSync(outputPath).size / 1024).toFixed(2)} kB)`
            );

            return result;
        });

        if (i % 2) {
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
