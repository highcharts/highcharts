/* eslint-env node, es6 */
/* eslint-disable */

'use strict';
const {
    createReadStream,
    createWriteStream,
    stat,
    mkdir
} = require('fs');

const {
    dirname,
    join,
    resolve,
    sep
} = require('path');

const log = (txt) => {
    console.log(txt); // eslint-disable-line no-console
};

const error = (txt) => {
    throw new Error(txt);
};

/**
 * Promisify functions which has the error-first callback style.
 * In NodeJS v8 this polyfill can be replaced with util.promisify.
 *
 * @param {Function} fn The original function.
 * @return {Function} Returns a promisified function.
 */
const promisify = (fn) => {
    return function () {
        const ctx = this; // eslint-disable-line no-invalid-this
        const args = Array.from(arguments);
        return new Promise((resolvePromise, rejectPromise) => {
            args.push((err, data) => {
                if (err) {
                    rejectPromise(err);
                } else {
                    resolvePromise(data);
                }
            });
            fn.apply(ctx, args);
        });
    };
};

const statPromise = promisify(stat);
const mkdirPromise = promisify(mkdir);

/**
 * A script to check the listed version of a dependency mathes the one
 * installed by NPM.
 * @param {string} name Package name
 * @param {string} severity The level of severity if there is a mismatch.
 * Possible values are 'warn' and 'err'. Defaults to 'warn'.
 * @param {string} type What type of dependency. Possible values are
 * 'dependencies' and 'devDependencies'. Defaults to 'dependencies'.
 * @return {undefined}
 */
const checkDependency = (name, severity = 'warn', type = 'dependencies') => {
    const pathPackage = resolve('./package.json');
    const dependency = require(pathPackage)[type][name];
    if (!dependency) {
        error(`Package ${name} is not listed in ${type}`);
    }

    const actual = require(`${name}/package.json`).version;
    const mismatch = !dependency.endsWith(actual);
    const action = {
        warn: (message) => log(message.yellow),
        err: (message) => error(message)
    };
    if (mismatch) {
        if (action[severity]) {
            action[severity](`The installed version of ${name} is ${actual}, while listed version in ${type} is ${dependency}. Please update to the required version by executing "npm install ${name}"`);
        } else {
            error(`Parameter "severity" has invalid value: ${severity}`);
        }
    }
};

/**
 * Takes a folder path and creates all the missing folders
 * @param  {string} path Path to directory
 * @return {Promise} Returns a promise that resolves when final directory has
 * been created.
 */
const createDirectory = path => {
    const folders = path.split(sep).join('/').split('/');
    let directory = '';
    return folders.reduce((promise, name) => {
        const p = join(directory, name);
        directory = p;
        return promise
        // Check if the directory exists
        .then(() => statPromise(p))
        // If errors then create the directory
        .catch(() => mkdirPromise(p)
            // If mkdirPromise errors, then the directory already exists
            .catch(() => {})
        );
    }, Promise.resolve());
};

const copyFile = (source, target) => {
    const directory = dirname(target);
    return createDirectory(directory)
    .then(() => new Promise((resolvePromise, rejectPromise) => {
        let read = createReadStream(source);
        let write = createWriteStream(target);
        const onError = (err) => {
            read.destroy();
            write.end();
            rejectPromise(err);
        };
        read.on('error', onError);
        write.on('error', onError);
        write.on('finish', resolvePromise);
        read.pipe(write);

    }));
};

module.exports = {
    checkDependency,
    copyFile,
    createDirectory,
    promisify
};
