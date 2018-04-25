/* eslint-env node, es6 */
/* eslint no-console:0, no-path-concat:0, no-nested-ternary:0, valid-jsdoc:0 */
/* eslint-disable func-style */
const closureCompiler = require('google-closure-compiler-js');
const statSync = require('fs').statSync;
const {
    getFile,
    writeFile
} = require('highcharts-assembler/src/utilities.js');
const colors = require('colors');

const compileSingleFile = (path, sourceFolder, createSourceMap) => {
    const sourcePath = sourceFolder + path;
    const outputPath = sourcePath.replace('.src.js', '.js');
    const src = getFile(sourcePath);
    const getErrorMessage = (e) => {
        return [
            'Compile error in file: ' + path,
            '- Type: ' + e.type,
            '- Line: ' + e.lineNo,
            '- Char : ' + e.charNo,
            '- Description: ' + e.description
        ].join('\n');
    };
    return new Promise((resolve, reject) => {
        const out = closureCompiler.compile({
            compilationLevel: 'SIMPLE_OPTIMIZATIONS',
            jsCode: [{
                src: src
            }],
            languageIn: 'ES5',
            languageOut: 'ES5',
            createSourceMap: createSourceMap
        });
        const errors = out.errors;
        if (errors.length) {
            const msg = errors.map(getErrorMessage).join('\n');
            reject(msg);
        } else {
            writeFile(outputPath, out.compiledCode);
            const filesize = statSync(outputPath).size;
            const filesizeKb = (filesize / 1000).toFixed(2) + ' kB';

            if (filesize < 10) {
                const msg = 'Compiled ' + sourcePath + ' => ' + outputPath +
                    ', filesize suspiciously small (' + filesizeKb + ')';
                console.log(colors.red(msg));
                reject(msg);
                return;
            }

            if (createSourceMap) {
                writeFile(outputPath + '.map', out.sourceMap);
            }
            console.log(
                colors.green('Compiled ' + sourcePath + ' => ' + outputPath) +
                colors.gray(' (' + filesizeKb + ')')
            );
            resolve();
        }
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
