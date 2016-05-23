"use strict";

let co = require('co');
let fs = require('co-fs-extra');
let request = require('co-request');
let properties = require('properties');

co(function* () {
    let props = yield new Promise((resolve, reject) => {
        properties.parse ("git-ignore-me.properties", { path: true }, function (error, props){
            return error ? reject(error) : resolve(props);
        });
    });

    let result = yield request({
        uri: props['cloud.uri'] + "/api/charts/popular/",
        method: "POST",
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
        let scriptResult = yield request.get(props['cloud.uri'] + "/inject/" + hashes[i]);
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

function wrap(script) {
    return "window.addEventListener('DOMContentLoaded', function () {" + script + "});\n";
}

function html(hash) {
    return '<script src="https://code.highcharts.com/stock/highstock.js"></script>' +
        '<script src="https://code.highcharts.com/stock/modules/data.js"></script>' +
        '<script src="https://code.highcharts.com/stock/modules/exporting.js"></script>' +
        '<div id="highcharts-' + hash + '"></div>'
}
