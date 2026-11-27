/*
 * Copyright (C) Highsoft AS
 */

const semver = require('semver');

/**
 * Select the canonical version shared by a product's release packages.
 * @param {object} products Parsed product manifest.
 * @param {string} productName Product being released.
 * @return {string} Validated release version, including build metadata.
 */
function getReleaseVersion(products, productName) {
    const keys = {
        Highcharts: ['Highcharts'],
        Grid: ['Highcharts Grid Lite', 'Highcharts Grid Pro'],
        Dashboards: ['Highcharts Dashboards']
    };
    if (!Object.hasOwn(keys, productName)) {
        throw new Error('Unsupported release product: ' + productName);
    }
    const versions = keys[productName].map(key => {
        const entry = products && Object.hasOwn(products, key) && products[key];
        const version = entry && entry.nr;
        const parsed = typeof version === 'string' && semver.parse(version);
        const canonical = parsed && parsed.version +
            (parsed.build.length ? '+' + parsed.build.join('.') : '');
        if (!parsed || canonical !== version) {
            throw new Error('Missing or invalid release version for ' + key);
        }
        return version;
    });
    if (versions.some(version => version !== versions[0])) {
        throw new Error('Grid Lite and Pro release versions must match');
    }
    return versions[0];
}

module.exports = { getReleaseVersion };
