/*
 * Copyright (C) Highsoft AS
 */

/* eslint no-console:0 */

const FS = require('fs');
const Glob = require('glob');
const Path = require('path');

const CWD = process.cwd();

/**
 * Replaces last pattern in a string.
 *
 * @param {string} str
 *        String to modify.
 *
 * @param {string} pattern
 *        Pattern to search.
 *
 * @param {string} replacement
 *        Replacement for pattern.
 *
 * @return {string}
 *         Modified string.
 */
function replaceLast(str, pattern, replacement) {

    if (!str || !pattern || !replacement) {
        return str;
    }

    const lastIndex = str.lastIndexOf(pattern);

    return str.substr(0, lastIndex) + str.substr(lastIndex).replace(pattern, replacement);
}

/**
 * Converts the module loader of a given file.
 *
 * @param {string} file
 *        File to change.
 *
 * @return {Promise}
 *         Promise to keep.
 */
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
            code = replaceLast(code, '});', '}));');
            FS.writeFileSync(file, code);
            console.info(Path.relative(CWD, file), 'converted');
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = function () {
    const path = Path.join(__dirname, '..', 'ts', 'masters');
    return Promise.all(
        Glob
            .sync(Path.join(path, 'tsconfig-*.json'))
            .map(file => require(file).compilerOptions.outFile)
            .map(file => Path.join(path, file))
            .map(convert)
    );
};
