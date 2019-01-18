/*
 * Copyright (C) Highsoft AS
 */

/* eslint no-console:0 */

// const FS = require('fs');
// const Glob = require('glob');
// const Path = require('path');
const ProcessLib = require('./lib/process');
// const StringLib = require('./lib/string');

/**
 * Converts the module loader of a given file.
 *
 * @param {string} file
 *        File to change.
 *
 * @return {Promise}
 *         Promise to keep.
 * /
function convert(file) {
    return new Promise((resolve, reject) => {
        try {
            let code = FS.readFileSync(file).toString();
            code = code.replace(
                /define\(\"[^\"]+\"\, \[[^\]]*\]\, function \([^\)]+\) \{/g,
                `(function (factory) {
    if (typeof module === 'object' && module.exports) {
        factory.default = factory;
        module.exports = factory;
    } else if (typeof define === 'function' && define.amd) {
        define(function () {
            return factory;
        });
    } else {
        factory(typeof Highcharts !== 'undefined' ? Highcharts : undefined);
    }
}(function (Highcharts, H) {
    H = Highcharts;`
            );
            code = StringLib.replaceLast(code, '});', '}));');
            FS.writeFileSync(file, code);
            console.info(Path.relative(ProcessLib.CWD, file), 'converted');
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * Compiles TypeScript code into the js folder.
 *
 * @return {Promise}
 *         Promise to keep.
 */
module.exports = function () {
    return ProcessLib.commandLine('npx tsc --project ts');
/*
    For final switch to TypeScript
    return Promise
        .all(
            Glob.sync(Path.join('ts', 'masters', 'tsconfig-*.json'))
                .map(file => ProcessLib.commandLine(
                    'npx tsc --build ' + file + ' --verbose'
                ))
        )
        .then(() => {
            const path = Path.join(__dirname, '..', '..', 'ts', 'masters');
            return Promise.all(
                Glob
                    .sync(Path.join(path, 'tsconfig-*.json'))
                    .map(file => require(file).compilerOptions.outFile)
                    .map(file => Path.join(path, file))
                    .map(convert)
            );
        });
*/
};
