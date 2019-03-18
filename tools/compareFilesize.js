/* eslint-disable func-style, no-confusing-arrow */
const { getBuildScripts } = require('./build.js');
const { compile } = require('./compile.js');
const { sync: gzipSize } = require('gzip-size');
const { getFile, writeFilePromise: writeFile } =
    require('highcharts-assembler/src/utilities.js');
const { join, resolve } = require('path');

// TODO: write JSDoc
const log = x => {
    console.log(x); // eslint-disable-line no-console
};

// TODO: write JSDoc
const pad = (x, length) => x.padEnd(length, ' ');

// TODO: write JSDoc
const getMaxStringLength = arr => arr
    .reduce((max, str) => ((max > str.length) ? max : str.length), 0);

// TODO: write JSDoc
const formatColumn = (rows, length) => rows
    .map(str => `| ${pad(str, length)} `);

// TODO: write JSDoc
const formatColumns = obj => {
    const headers = Object.keys(obj);
    headers.forEach(header => {
        const length = getMaxStringLength(obj[header]);
        const head = [header, '-'.repeat(length)];
        obj[header] = formatColumn(
            head.concat(obj[header]),
            length
        );
    });

    const length = obj[headers[0]].length;
    const rows = Array.from({ length })
        .map((_, i) => (
            headers
                .map(header => obj[header][i])
                .join('')
        ) + ' |');
    rows.push('-'.repeat(rows[0].length));
    return rows;
};

/**
 * Creates a list of bytesize for the new file, old file, and the difference.
 *
 * @param {string} key The key to check againts. Can be gzip, compiled, or size.
 * @param {object} oldFileSizes The map from filename to size for the old files.
 * @param {object} newFileSizes The map from filename to size for the new files.
 * @return {object} The map
 */
const getNewOldDiff = (key, oldFileSizes, newFileSizes) => Object
    .keys(oldFileSizes)
    .reduce((obj, filename) => {
        const N = newFileSizes[filename][key];
        const O = oldFileSizes[filename][key];
        const D = N - O;
        obj.New.push(N + ' B');
        obj.Old.push(O + ' B');
        obj.Diff.push(D + ' B');
        return obj;
    }, {
        New: [],
        Old: [],
        Diff: []
    });

const getCompareFileSizeTable = (pathOld, pathNew, out) => {
    const oldObj = require(resolve(pathOld));
    const newObj = require(resolve(pathNew));

    // Create columns for gzip, compiled and size
    const gzip = getNewOldDiff('gzip', oldObj, newObj);
    const compiled = getNewOldDiff('compiled', oldObj, newObj);
    const size = getNewOldDiff('size', oldObj, newObj);

    const columns = {
        'Filename:': ['', ''].concat(Object.keys(oldObj)),
        'Gzipped:': formatColumns(gzip),
        'Compiled:': formatColumns(compiled),
        'Size:': formatColumns(size)
    };
    const table = formatColumns(columns).join('\n');
    return out ? writeFile(out, table) : Promise.resolve(log(table));
};

const getFileSizes = (files, out) => {
    const sourceFolder = './code/';

    // Output the result to the console, or a file if filePath is defined
    const outputResult = (obj, filePath) => {
        const str = JSON.stringify(obj, null, '  ');
        return filePath ? writeFile(filePath, str) : Promise.resolve(log(str));
    };

    // Finds
    const getSizeOfSourceCompiledAndGzip = filenames => filenames.reduce(
        (obj, filename) => {
            const compileName = filename.replace('.src.js', '.js');
            const compiled = getFile(join(sourceFolder, compileName));
            obj[filename] = {
                gzip: gzipSize(compiled),
                size: getFile(join(sourceFolder, filename)).length,
                compiled: compiled.length
            };
            return obj;
        },
        {}
    );

    return Promise.resolve()
        .then(getBuildScripts({ files }).fnFirstBuild)
        .then(() => compile(files, sourceFolder))
        .then(() => getSizeOfSourceCompiledAndGzip(files))
        .then(result => outputResult(result, out));
};

module.exports = {
    getCompareFileSizeTable,
    getFileSizes
};
