/* eslint-env browser */
/* global __karma__, Highcharts, Promise, QUnit */

/**
 * This file runs in the browser as setup for the karma tests.
 */

var div;
if (!document.getElementById('container')) {
    div = document.createElement('div');
    div.setAttribute('id', 'container');
    document.body.appendChild(div);
}
if (!document.getElementById('output')) {
    div = document.createElement('div');
    div.setAttribute('id', 'output');
    document.body.appendChild(div);
}
var demoHTML = document.createElement('div');
demoHTML.setAttribute('id', 'demo-html');
document.body.appendChild(demoHTML);

var canvas = document.createElement('canvas');
canvas.setAttribute('width', 300);
canvas.setAttribute('height', 200);
var ctx = canvas.getContext('2d');

// Disable animation over all.
Highcharts.setOptions({
    chart: {
        animation: false
    },
    plotOptions: {
        series: {
            animation: false,
            kdNow: true,
            dataLabels: {
                defer: false
            }
        }
    },
    tooltip: {
        animation: false
    }
});

Highcharts.defaultOptionsRaw = JSON.stringify(Highcharts.defaultOptions);
Highcharts.callbacksRaw = Highcharts.Chart.prototype.callbacks.slice(0);


/*
 * Compare numbers taking in account an error.
 * http://bumbu.me/comparing-numbers-approximately-in-qunitjs/
 *
 * @param  {Float} number
 * @param  {Float} expected
 * @param  {Float} error    Optional
 * @param  {String} message  Optional
 */
QUnit.assert.close = function (number, expected, error, message) {
    if (error === void 0 || error === null) {
        error = 0.00001; // default error
    }

    var result = number === expected || (number <= expected + error && number >= expected - error) || false;

    this.pushResult({
        result: result,
        actual: number,
        expected: expected,
        message: message
    });
};

QUnit.module('Highcharts', {
    beforeEach: function () {

        // Reset container size that some tests may have modified
        var containerStyle = document.getElementById('container').style;
        containerStyle.width = 'auto';
        containerStyle.height = 'auto';
        containerStyle.position = 'absolute';
        containerStyle.left = '8';
        containerStyle.top = '8';
        containerStyle.zIndex = '9999';

        // Reset randomizer
        Math.randomCursor = 0;
    },

    afterEach: function () {

        var containerStyle = document.getElementById('container').style;
        containerStyle.width = '';
        containerStyle.height = '';
        containerStyle.position = '';
        containerStyle.left = '';
        containerStyle.top = '';
        containerStyle.zIndex = '';

        var currentChart = null,
            charts = Highcharts.charts,
            templateCharts = [];

        // Destroy all charts, except template charts
        for (var i = 0, ie = charts.length; i < ie; ++i) {
            currentChart = charts[i];
            if (!currentChart) {
                continue;
            }
            if (currentChart.template) {
                templateCharts.push(currentChart);
            } else if (currentChart.destroy && currentChart.renderer) {
                currentChart.destroy();
            }
        }

        Highcharts.charts.length = 0;
        Array.prototype.push.apply(Highcharts.charts, templateCharts);
    }
});

/*
 * Display the tooltip so it gets part of the comparison
 */
Highcharts.prepareShot = function (chart) {
    if (
        chart &&
        chart.series &&
        chart.series[0] &&
        chart.series[0].points &&
        chart.series[0].points[0] &&
        typeof chart.series[0].points[0].onMouseOver === 'function'
    ) {
        chart.series[0].points[0].onMouseOver();
    }
};

/**
 * Get the SVG of a chart, or the first SVG in the page
 * @param  {Object} chart The chart
 * @return {String}       The SVG
 */
function getSVG(chart) {
    var svg;
    if (chart) {
        var container = chart.container;
        Highcharts.prepareShot(chart);
        svg = container.querySelector('svg').outerHTML;

    // Renderer samples
    } else {
        if (document.getElementsByTagName('svg').length) {
            svg = document.getElementsByTagName('svg')[0].outerHTML;
        }
    }
    return svg;
}

/**
 * Compares the image data of two canvases
 * @param  {Array} data1 Pixel data for image1.
 * @param  {Array} data2 Pixel data for image2.
 * @return {Number}      The amount of different pixels, where 0 is idenitcal
 */
function compare(data1, data2) { // eslint-disable-line no-unused-vars
    var i = data1.length,
        diff = 0,
        pixels = [],
        pixel;

    // loops over all reds, greens, blues and alphas
    while (i--) {
        pixel = Math.floor(i / 4);
        if (Math.abs(data1[i] - data2[i]) !== 0 && !pixels[pixel]) {
            pixels[pixel] = true;
            diff++;
        }
    }

    return diff;
}

/**
 * Get a PNG image or image data from the chart SVG.
 * @param  {Object} chart The chart instance
 * @param  {String} path  The sample path
 * @return {String}       The image data
 */
function compareToReference(chart, path) { // eslint-disable-line no-unused-vars

    return new Promise(function (resolve, reject) {

        var referenceData,
            candidateSVG = getSVG(chart),
            candidateData;

        function svgToPixels(svg, callback) { // eslint-disable-line require-jsdoc
            try {
                var DOMURL = (window.URL || window.webkitURL || window);

                var img = new Image(),
                    blob = new Blob([svg], { type: 'image/svg+xml' }),
                    url = DOMURL.createObjectURL(blob);
                img.onload = function () {
                    ctx.clearRect(0, 0, 300, 200);
                    ctx.drawImage(img, 0, 0, 300, 200);
                    callback(ctx.getImageData(0, 0, 300, 200).data);
                };
                img.onerror = function () {
                    // console.log(svg)
                    reject(
                        'Error loading SVG on canvas'
                    );
                };
                img.src = url;
            } catch (e) {
                reject(e.message);
            }
        }

        function doComparison() { // eslint-disable-line require-jsdoc
            if (referenceData && candidateData) {
                var diff = compare(referenceData, candidateData);

                if (diff !== 0) {
                    __karma__.info({
                        filename: './samples/' + path + '/diff.gif',
                        frames: [
                            referenceData,
                            candidateData
                        ]
                    });
                    __karma__.info({
                        filename: './samples/' + path + '/candidate.svg',
                        data: candidateSVG
                    });
                }

                resolve(diff);
            }
        }

        // Handle candidate
        if (candidateSVG) {
            svgToPixels(candidateSVG, function (data) {
                candidateData = data;
                doComparison();
            });
        } else {
            reject('No candidate SVG found');
        }

        // Handle reference, load SVG from file
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'base/samples/' + path + '/reference.svg', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var svg = xhr.responseText;

                svgToPixels(svg, function (data) {
                    referenceData = data;
                    doComparison();
                });
            }
        };
        xhr.send();

    });

}

// De-randomize Math.random in tests
(function () {
    var randomValues = [0.14102989272214472, 0.0351817375048995,
        0.10094573209062219, 0.35990892769768834, 0.7690574480220675,
        0.16634021210484207, 0.3944594960194081, 0.7656398438848555,
        0.27706647920422256, 0.5681763959582895, 0.513730650767684,
        0.26344996923580766, 0.09001278411597013, 0.2977627406362444,
        0.6982127586379647, 0.9593012358527631, 0.8456065070349723,
        0.26248381356708705, 0.12872424302622676, 0.25530692492611706,
        0.9969052199739963, 0.09259856841526926, 0.9022860133554786,
        0.3393681487068534, 0.41671016393229365, 0.10582929337397218,
        0.1322793234139681, 0.595869708340615, 0.050670077092945576,
        0.8613549116998911, 0.17356411134824157, 0.16447093593887985,
        0.44514468451961875, 0.15736589767038822, 0.8677479331381619,
        0.30932203005068004, 0.6120233973488212, 0.001859797164797783,
        0.7689258102327585, 0.7421043077483773, 0.7548440918326378,
        0.9667320610024035, 0.13654314493760467, 0.6277681242208928,
        0.002858637133613229, 0.6877673089038581, 0.44036358245648444,
        0.3101970909629017, 0.013212101766839623, 0.7115063068922609,
        0.2931885647121817, 0.5031651991885155, 0.8921459852717817,
        0.547999506117776, 0.010382920736446977, 0.9862914837431163,
        0.9629317701328546, 0.07685352209955454, 0.2859949553385377,
        0.5578324059024453, 0.7765828191768378, 0.1696563793811947,
        0.34366130153648555, 0.11959927808493376, 0.8898638435639441,
        0.8963573810178787, 0.332408863119781, 0.27137733018025756,
        0.3066735703032464, 0.2789501305669546, 0.4567076754756272,
        0.09539463231340051, 0.9158625246491283, 0.2145260546822101,
        0.8913846455980092, 0.22340057184919715, 0.09033847553655505,
        0.49042539740912616, 0.4070818084292114, 0.5827512110117823,
        0.1993762720376253, 0.9264022477436811, 0.3290765874553472,
        0.07792594563215971, 0.7663758248090744, 0.4329648329876363,
        0.10257583996281028, 0.8170149670913815, 0.41387700103223324,
        0.7504217880778015, 0.08603733032941818, 0.17256441875360906,
        0.4064991301856935, 0.829071992309764, 0.6997416105587035,
        0.2686419754754752, 0.36025605257600546, 0.6014082923065871,
        0.9787689209915698, 0.016065671807155013];
    Math.randomCursor = 0;
    Math.random = function () {
        var ret = randomValues[
            Math.randomCursor % randomValues.length
        ];
        Math.randomCursor++;
        return ret;
    };
}());

// Override getJSON
window.JSONSources = {};
$.getJSON = function (url, callback) { // eslint-disable-line no-undef
    callback(window.JSONSources[url]);
};
