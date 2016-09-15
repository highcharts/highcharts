/* eslint-env node, es6 */
/* eslint func-style: ["error", "expression"] */
'use strict';
const debug = (d, text) => {
    if (d) {
        /* eslint-disable no-console */
        console.log(text);
        /* eslint-enable no-console */
    }
};

/**
 * Gets directory path from a file path
 * @param  {string} path File path
 * @returns {string} Path to directory where the file is located
 */
const folder = path => {
    let folderPath = '.';
    if (path !== '') {
        folderPath = path.substring(0, path.lastIndexOf('/'));
    }
    return folderPath + '/';
};

/**
 * Takes a folder path and creates all the missing folders
 * @param  {string} path Path to directory
 * @returns {undefined} Returns nothing
 */
const createDirectory = path => {
    const fs = require('fs');
    const folders = path.split('/');
    folders.reduce((base, name) => {
        const p = base + name;
        try {
            fs.statSync(p);
        } catch (err) {
            fs.mkdirSync(p);
        }
        return p + '/';
    }, '');
};

const writeFile = (path, content) => {
    const fs = require('fs');
    createDirectory(folder(path));
    fs.writeFileSync(path, content);
};

module.exports = {
    createDirectory,
    debug,
    folder,
    writeFile
};
