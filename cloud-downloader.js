/* eslint-env node, es6 */
/* eslint no-console: 0, require-jsdoc: 0 */

/**
 * This script retrieves the n most popular charts from cloud.highcharts.com, downloads
 * the configurations and prepare them for side-by-side testing in
 * http://utils.highcharts.local/samples.
 * The downloaded charts can be viewed under the "cloud" heading.
 */

'use strict';

let co = require('co');
let fs = require('co-fs-extra');
let request = require('co-request');
let properties = require('properties');


function wrap(script) {
    return 'window.addEventListener("DOMContentLoaded", function () {' + script + '});\n';
}

function html(hash) {
    return '<script src="https://code.highcharts.com/stock/highstock.js"></script>' +
        '<script src="https://code.highcharts.com/stock/modules/data.js"></script>' +
        '<script src="https://code.highcharts.com/stock/modules/exporting.js"></script>' +
        '<div id="highcharts-' + hash + '"></div>';
}

co(function* () {
    let props = yield new Promise((resolve, reject) => {
        properties.parse('git-ignore-me.properties', { path: true }, function (error, obj) {
            return error ? reject(error) : resolve(obj);
        });
    });

    let result = yield request({
        uri: props['cloud.uri'] + '/api/charts/popular/',
        method: 'POST',
        json: {
            authentication: props['cloud.authentication'],
            limit: props['cloud.limit']
        }
    });

    let hashes = result.body;

    let jsFile = 'demo.js';
    let htmlFile = 'demo.html';
    let targetDir = './samples/cloud/charts/';

    yield fs.ensureDir(targetDir);

    for (let i = 0; i < hashes.length; i++) {
        console.log('Downloading script: ' + hashes[i] + ' (' + (i + 1) + '/' + hashes.length + ')');
        let scriptResult = yield request.get(props['cloud.uri'] + '/inject/' + hashes[i]);
        let script = scriptResult.body;

        let path = targetDir + hashes[i] + '/';

        yield fs.ensureDir(path);
        yield fs.remove(path + jsFile);
        yield fs.remove(path + htmlFile);
        yield fs.writeFile(path + jsFile, wrap(script));
        yield fs.writeFile(path + htmlFile, html(hashes[i]));
    }

}).catch(function (err) {
    console.log(err);
});
