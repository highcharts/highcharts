/*
 * Copyright (C) Highsoft AS
 */

const fs = require('fs-extra');
const { EOL } = require('os');

/**
 * Convert a properties file line to a nested object.
 *
 * @param {obj} obj that ends up with the result
 * @param {path}  path, e.g 'my.obj.param'
 * @param {value} value that 'my.obj.param' holds
 *
 * @return {obj} obj is a nested object based off the property strings.
 */
function propertyStringToObj(obj, path, value = null) {
    path = typeof path === 'string' ? path.split('.') : path;
    let current = obj;
    while (path.length > 1) {
        const [head, ...tail] = path;
        path = tail;
        // eslint-disable-next-line no-undefined
        if (current[head] === undefined) {
            current[head] = {};
        }
        current = current[head];
    }
    current[path[0]] = value;
    return obj;
}

/**
 * Retrieves the build properties which are used in the distribution process.
 *
 * @return {properties} properties containing product name and version (build.properties).
 */
function getBuildProperties() {
    const properties = {};

    try {
        const lines = fs.readFileSync(
            './build.properties', 'utf8'
        );
        lines.split(EOL).forEach(function (line) {
            if (!line.startsWith('#')) {
                const splitLine = line.split('=');
                if (splitLine[0]) {
                    propertyStringToObj(properties, splitLine[0], splitLine[1]);
                }
            }
        });
    } catch (e) {
        throw new Error(
            'Couldn\'t find a build.properties file'
        );
    }
    return properties;
}


module.exports = {
    getBuildProperties
};
