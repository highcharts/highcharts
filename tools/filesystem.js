/* eslint-env node, es6 */
/* eslint-disable func-style */

'use strict';
const {
  resolve
} = require('path');

const log = (txt) => {
    console.log(txt); // eslint-disable-line no-console
};

const error = (txt) => {
    throw new Error(txt);
};

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

module.exports = {
    checkDependency
};
