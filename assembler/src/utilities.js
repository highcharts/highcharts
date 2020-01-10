/* eslint-env node, es6 */
/* eslint func-style: ["error", "expression"] */
'use strict';
const {
    dirname
} = require('path');
const {
    mkdirSync,
    readdirSync,
    readFileSync,
    rmdirSync,
    statSync,
    unlink,
    writeFile,
    writeFileSync
} = require('fs');

const isUndefined = x => (typeof x === 'undefined');

const isString = string => (typeof string === 'string');

const isBool = x => (typeof x === 'boolean');

const isArray = x => Array.isArray(x);

const isNull = x => x === null;

const isObject = x => ((typeof x === 'object') && !isArray(x) && !isNull(x));

const isFunction = x => (typeof x === 'function');

const debug = (d, text) => {
    if (d) {
    /* eslint-disable no-console */
        console.log(text);
    /* eslint-enable no-console */
    }
};

/**
 * Check wether a file path exists or not.
 * @param  {string} path Path to file or directory
 * @return {boolean} True if path exists, false if not.
 */
const exists = path => {
    let e = true;
    try {
        statSync(path);
    } catch (err) {
        e = false;
    }
    return e;
};

/**
 * Get content of file.
 * @param  {string} path Path to file.
 * @return {string|null} Returns content of file as a string. Returns null if file is not found.
 */
const getFile = path => (exists(path) ? readFileSync(path, 'utf8') : null);

/**
 * Takes a folder path and creates all the missing folders
 * @param  {string} path Path to directory
 * @return {undefined} Returns nothing
 */
const createDirectory = path => {
    const folders = path.split(/[/\\]/g);
    folders.reduce((base, name) => {
        const p = base + name;
        try {
            statSync(p);
        } catch (err) {
            if (p) {
                mkdirSync(p);
            }
        }
        return p + '/';
    }, '');
};

/**
 * Removes a file.
 * Creates a promise which resolves when the file is deleted.
 * Promise is rejected if the file does not exist.
 * @param  {string} path Path to file
 * @return {Promise} Returns a promise which resolves when the file is deleted.
 */
const removeFile = path => new Promise(resolve => {
    if (exists(path)) {
        unlink(path, () => {
            resolve(true);
        });
    } else {
    // reject(new Error('File does not exist: ' + path))
        resolve(true);
    }
});

/**
 * Removes a directory.
 * Creates a promise which resolves when the directory is deleted.
 * Promise is rejected if the file does not exist.
 * @param  {string} path Path to file
 * @return {Promise} Returns a promise which resolves when the file is deleted.
 */
const removeDirectory = path => new Promise((resolve, reject) => {
    if (exists(path)) {
        const files = readdirSync(path);
        const promises = files.map(file => path + '/' + file)
            .map(itemPath => ((statSync(itemPath).isDirectory()) ? removeDirectory(itemPath) : removeFile(itemPath)));
        Promise.all(promises).then(() => {
            rmdirSync(path);
            resolve(true);
        })
            .catch(err => reject(new Error(err.message + '\n\r' + err.stack)));
    } else {
    // reject(new Error('Directory does not exist: ' + path))
        resolve(true);
    }
});

const writeFileCustom = (path, content) => {
    createDirectory(dirname(path));
    writeFileSync(path, content);
};

const writeFilePromise = (path, content) => {
    createDirectory(dirname(path));
    return new Promise((resolve, reject) => {
        writeFile(path, content, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

module.exports = {
    createDirectory,
    debug,
    exists,
    getFile,
    isArray,
    isBool,
    isFunction,
    isNull,
    isObject,
    isString,
    isUndefined,
    removeDirectory,
    removeFile,
    writeFile: writeFileCustom,
    writeFilePromise
};
