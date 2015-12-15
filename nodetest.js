/* global require */
var jsdom = require('jsdom');
var doc = jsdom.jsdom('<!doctype html><html><body><div id="container"></div></body></html>');
var win = doc.defaultView;
var fs = require('fs');
doc.createElementNS = function (ns, tagName) {
    var elem = doc.createElement(tagName);

    // Pass Highcharts' test for SVG capabilities
    elem.createSVGRect = function () {};
    elem.getBBox = function () {
        return {
            x: parseInt(win.getComputedStyle(elem).marginLeft || 0, 10),
            y: parseInt(win.getComputedStyle(elem).marginTop || 0, 10),
            width: parseInt(win.getComputedStyle(elem).width || 0, 10),
            height: parseInt(win.getComputedStyle(elem).height || 0, 10)
        };
    };
    return elem;
};

var Highcharts = require('./js/highcharts.src')(win);

require('./js/modules/exporting.src')(Highcharts);


Highcharts.chart('container', {
    chart: {
        width: 600,
        height: 400,
        forExport: true
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});




/*
var child = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
doc.getElementById('container').appendChild(child)
*/
fs.writeFile('node.svg', doc.getElementById('container').innerHTML);
