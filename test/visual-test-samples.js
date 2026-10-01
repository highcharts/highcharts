/* eslint-env node, es6 */

const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

/**
 * Samples excluded from Karma visual tests.
 *
 * Keep these paths in the same form as Karma's `exclude` configuration so
 * other visual test runners can use the same eligibility rules.
 *
 * @type {Array<string>}
 */
const excludedSamples = [
    // --- VISUAL TESTS ---

    // Custom data source
    'samples/highcharts/blog/annotations-aapl-iphone/demo.js',
    'samples/highcharts/blog/gdp-growth-annual/demo.js',
    'samples/highcharts/blog/gdp-growth-multiple-request-v2/demo.js',
    'samples/highcharts/blog/gdp-growth-multiple-request/demo.js',
    'samples/highcharts/website/xmas-2021/demo.js',

    // Error #13, renders to other divs than #container. Sets global
    // options.
    'samples/highcharts/demo/bullet-graph/demo.js',
    // Network loading?
    'samples/highcharts/demo/combo-meteogram/demo.js',

    // CSV data, parser fails - why??
    'samples/highcharts/demo/line-csv/demo.js',

    // Clock
    'samples/highcharts/demo/dynamic-update/demo.js',
    'samples/highcharts/demo/gauge-clock/demo.js',
    'samples/highcharts/demo/gauge-vu-meter/demo.js',

    // Too heavy
    'samples/highcharts/demo/parallel-coordinates/demo.js',
    'samples/highcharts/demo/sparkline/demo.js',

    // Maps
    'samples/maps/demo/map-pies/demo.js', // advanced data
    'samples/maps/demo/us-counties/demo.js', // advanced data
    'samples/maps/plotoptions/series-animation-true/demo.js', // animation
    'samples/highcharts/blog/map-europe-electricity-price/demo.js', // strange fails, remove this later

    // Unknown error
    'samples/highcharts/boost/arearange/demo.js',
    'samples/highcharts/boost/scatter-smaller/demo.js',
    'samples/highcharts/data/google-spreadsheet/demo.js',

    // Various
    'samples/highcharts/data/delimiters/demo.js', // data island
    'samples/highcharts/css/exporting/demo.js', // advanced demo
    'samples/highcharts/css/pattern/demo.js', // styled mode, setOptions
    'samples/highcharts/studies/logistics/demo.js', // overriding

    // Failing on Edge only
    'samples/unit-tests/pointer/members/demo.js',

    // visual tests excluded for now due to failure
    'samples/highcharts/demo/funnel3d/demo.js',
    'samples/highcharts/demo/live-data/demo.js',
    'samples/highcharts/demo/organization-chart/demo.js',
    'samples/highcharts/demo/pareto/demo.js',
    'samples/highcharts/demo/pyramid3d/demo.js',
    'samples/highcharts/demo/synchronized-charts/demo.js',

    // Visual test fails due to external library used
    'samples/highcharts/blog/ternary-blade-steels/demo.js',
    'samples/highcharts/demo/combo-regression/demo.js'
];

/**
 * Normalize a sample identifier to its directory path under samples.
 *
 * @param {string} sampleId
 *        Sample path, with or without a samples/ prefix and demo extension.
 * @return {string}
 *         Normalized sample path.
 */
function normalizeSampleId(sampleId) {
    return sampleId
        .replace(/\\/gu, '/')
        .replace(/^\.\//u, '')
        .replace(/^samples\//u, '')
        .replace(/\/demo\.(?:m?js|ts)$/iu, '');
}

const normalizedExcludedSamples = new Set(
    excludedSamples.map(normalizeSampleId)
);

/**
 * Get the reason a sample is excluded from visual tests.
 *
 * @param {string} root
 *        Repository root containing the samples directory.
 * @param {string} sampleId
 *        Sample path, such as highcharts/demo/area-missing.
 * @return {string|undefined}
 *         A skip reason, or undefined when the sample is eligible.
 */
function getVisualSampleSkipReason(root, sampleId) {
    if (typeof root !== 'string' || typeof sampleId !== 'string') {
        return 'invalid sample path';
    }

    const normalizedSampleId = normalizeSampleId(sampleId);

    if (normalizedExcludedSamples.has(normalizedSampleId)) {
        return 'excluded from Karma visual tests';
    }

    const detailsPath = path.join(
        root,
        'samples',
        normalizedSampleId,
        'demo.details'
    );

    let detailsText;
    try {
        detailsText = fs.readFileSync(detailsPath, 'utf8');
    } catch (error) {
        if (error && error.code === 'ENOENT') {
            return void 0;
        }
        throw error;
    }

    if (!detailsText.trim()) {
        return void 0;
    }

    const details = yaml.load(detailsText);

    if (details && details.skipTest) {
        return 'skipTest';
    }

    if (details && details.requiresManualTesting) {
        return 'requiresManualTesting';
    }

    return void 0;
}

module.exports = {
    excludedSamples,
    getVisualSampleSkipReason
};
