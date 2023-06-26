/*
 * Copyright (C) Highsoft AS
 */

/* eslint-disable no-use-before-define */

const fs = require('fs');
const gulp = require('gulp');
const path = require('path');

/* *
 *
 *  Functions
 *
 * */

// TODO: write JSDoc
function getMaxStringLength(arr) {
    return arr.reduce((max, str) => ((max > str.length) ? max : str.length), 0);
}

// TODO: write JSDoc
function formatColumns(obj) {
    const headers = Object.keys(obj);
    headers.forEach(header => {
        const length = getMaxStringLength(obj[header]);
        const head = [header, '-'.repeat(length)];
        obj[header] = head
            .concat(obj[header])
            .map(str => `| ${str.padEnd(length, ' ')} `);
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
}

// TODO: write JSDoc
function getCompareFileSizeTable(pathOld, pathNew, out) {
    const log = require('../lib/log');

    const oldObj = require(path.resolve(pathOld));
    const newObj = require(path.resolve(pathNew));

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
    return out ?
        fs.promises.writeFile(out, table) :
        Promise.resolve(log.message(table));
}

/**
 * Creates a list of bytesize for the new file, old file, and the difference.
 *
 * @param {string} key The key to check againts. Can be gzip, compiled, or size.
 * @param {object} oldFileSizes The map from filename to size for the old files.
 * @param {object} newFileSizes The map from filename to size for the new files.
 * @return {object} The map
 */
function getNewOldDiff(key, oldFileSizes, newFileSizes) {
    return Object
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
}

/* *
 *
 *  Tasks
 *
 * */

/**
 * Usage: npx gulp compare-filesizes --old old.json --new new.json
 *
 * Options:
 *   --old      Specify path to the "oldest" filesizes to compare. Required.
 *   --new      Specify path to the "newest" filesizes to compare. Required.
 *   --out      Specify where to store the resulting information. If not
 *              specifyed then the information will be outputted to the console.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function compareFilesizes() {
    const { argv } = require('yargs');
    const out = argv.out;
    const pathOld = argv.old;
    const pathNew = argv.new;

    if (!pathOld || !pathNew) {
        throw new Error(
            'This task requires paths to the files --old and --new'
        );
    }

    return getCompareFileSizeTable(pathOld, pathNew, out);
}

gulp.task('compare-filesizes', compareFilesizes);
