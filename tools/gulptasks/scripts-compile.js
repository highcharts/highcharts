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
function scriptsCompile() {
    const fs = require('fs'),
        fsLib = require('./lib/fs'),
        logLib = require('./lib/log'),
        path = require('path'),
        processLib = require('./lib/process');

    const promises = fsLib
        .getFilePaths('code', true)
        .filter(filePath => (
            !filePath.startsWith('code/es-modules/') &&
            filePath.endsWith('.src.js')
        ))
        .map(inputPath => {
            const language = (
                    inputPath.includes('/es5/') ?
                        'ECMASCRIPT5_STRICT' :
                        'ECMASCRIPT_2020'
                ),
                outputPath = inputPath.replace('.src.js', '.js'),
                outputMapPath = outputPath + '.map';

            // Compile file
            // See github.com/google/closure-compiler/wiki/Flags-and-Options
            return processLib.exec(
                'google-closure-compiler' +
                ' --compilation_level SIMPLE' +
                ` --create_source_map "${outputMapPath}"` +
                ` --js "${inputPath}"` +
                ` --js_output_file "${outputPath}"` +
                ` --language_in ${language}` +
                ` --language_out ${language}` +
                ' --platform native',
                { silent: 2 }

            // Fix source map reference
            ).then(result => {
                const outputMapFileName = path.basename(outputMapPath);

                // Still no option for it
                fs.appendFileSync(
                    outputPath,
                    `//# sourceMappingURL=${outputMapFileName}`
                );

                logLib.success(`Compiled ${inputPath} => ${outputPath}`);

                return result;
            });
        });

    return Promise.all(promises);
}

gulp.task('scripts-compile', scriptsCompile);
