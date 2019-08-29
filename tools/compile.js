/* eslint-env node, es6 */
/* eslint no-console:0, no-path-concat:0, no-nested-ternary:0, valid-jsdoc:0 */
/* eslint-disable func-style */
const ClosureCompiler = require('google-closure-compiler').jsCompiler;
const statSync = require('fs').statSync;
const {
    getFile,
    writeFile
} = require('highcharts-assembler/src/utilities.js');
const colors = require('colors');

const compileSingleFile = (path, sourceFolder, createSourceMap) => {
    const filenameIn = path.split('/').pop();
    const filenameOut = filenameIn.replace('.src.js', '.js');
    const sourcePath = sourceFolder + path;
    const outputPath = sourcePath.replace('.src.js', '.js');
    const src = getFile(sourcePath);
    return new Promise((resolve, reject) => {
        const closureCompiler = new ClosureCompiler({
            compilationLevel: 'SIMPLE_OPTIMIZATIONS',
            languageIn: 'ES5',
            languageOut: 'ES5',
            createSourceMap
        });
        closureCompiler.run([{
            path: filenameIn,
            src
        }], (exitCode, stdOut, errOut) => {
            if (exitCode) {
                const errors = errOut
                    .split('\n\n\n\n')
                    .filter(error => (
                        error.includes('(JSC_PARSE_ERROR)\n\n') &&
                        !error.includes(' ignoring it\n\n') &&
                        !error.includes(' tag\n\n')
                    ));
                if (errors.length) {
                    const msg = errors.join('\n\n---\n\n');
                    console.log(colors.red(msg));
                    reject(new Error(msg));
                    return;
                }
            }
            let compiledCode = stdOut[0].src;
            if (createSourceMap) {
                /**
                 * Hack to insert the file property in sourcemap, and the
                 * sourceMappingURL in the out file.
                 * TODO: the closure-compiler should likely be able to handle
                 * this if the configuration is correct.
                 */
                const sourceMappingURL = filenameOut + '.map';
                const mapJSON = JSON.parse(stdOut[0].sourceMap);
                mapJSON.file = sourceMappingURL;
                compiledCode =
                    `${compiledCode}\n//# sourceMappingURL=${sourceMappingURL}`;

                // Write the source map to file.
                writeFile(outputPath + '.map', JSON.stringify(mapJSON));
            }

            writeFile(outputPath, compiledCode);
            const filesize = statSync(outputPath).size;
            const filesizeKb = (filesize / 1000).toFixed(2) + ' kB';

            if (filesize < 100) {
                const msg = (
                    'Compiled ' + sourcePath + ' => ' + outputPath +
                    ', filesize suspiciously small (' + filesizeKb + ')'
                );
                console.log(colors.red(msg));
                reject(new Error(msg));
                return;
            }

            console.log(
                colors.green('Compiled ' + sourcePath + ' => ' + outputPath) +
                colors.gray(' (' + filesizeKb + ')')
            );
            resolve();
        });
    });
};

const compile = (files, sourceFolder) => {
    console.log(colors.yellow('Warning: This task may take a few minutes.'));
    const createSourceMap = true;
    const promises = files
        .map(path => compileSingleFile(path, sourceFolder, createSourceMap));
    return Promise.all(promises);
};

module.exports = {
    compile,
    compileSingleFile
};
