/* eslint-env browser */
/* eslint-disable */
/* global __karma__, require, define, Promise, QUnit */

/**
 * This file runs in the browser as setup for the karma tests.
 */

var CANVAS_WIDTH = 600;
var CANVAS_HEIGHT = 400;
var MODULES = '/base/code/es-modules';
var VERBOSE = false;

// HTML

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

// RequireJS

require.config({
    baseUrl: '/base', // karma specific root link
    packages: [{
        name: 'highcharts',
        main: 'highcharts'
    }],
    paths: {
        'highcharts': 'code',
        'highcharts/highcharts': 'code/highcharts.src',
        'highcharts/highmaps': 'code/highmaps.src',
        'highcharts/highstock': 'code/highstock.src',
        'highcharts/highcharts-3d': 'code/highcharts-3d.src',
        'highcharts/highcharts-gantt': 'code/highcharts-gantt.src',
        'highcharts/highcharts-more': 'code/highcharts-more.src'
    }
});

// Fetch

if (window.Promise) {
    window.fetch = function (url) {
        let data = window.JSONSources['' + url];

        if (typeof data === 'function') {
            data = data();
        }

        if (typeof data !== 'undefined') {
            return Promise.resolve({
                ok: true,
                status: 200,
                statusText: 'OK',
                type: 'basic',
                url,
                json: function () {
                    return Promise.resolve(data);
                },
                text: function () {
                    return Promise.resolve('' + data);
                },
            });
        }

        return Promise.reject(
            'Sample error, URL "' + url +
            '" missing in JSONSources (karma-fetch.js)'
        );
    };
}

// QUnit

var currentTests = [];

// Handle wrapping, reset functions that are wrapped in the visual samples to
// prevent the wraps from piling up downstream.
var wrappedFunctions = [];
var addedEvents = [];

if (window.QUnit) {
    // Fix the number localization in IE
    if (
        /msie/.test(navigator.userAgent) &&
        !Number.prototype._toString
    ) {
        Number.prototype._toString = Number.prototype.toString;
        Number.prototype.toString = function(radix) {
            if (radix) {
                return Number.prototype._toString.apply(this, arguments);
            } else {
                return this.toLocaleString('en', { useGrouping: false, maximumFractionDigits: 20 });
            }
        }
    }

    QUnit.module('[Highcharts Tests]', {
        beforeEach: function (test) {
            if (VERBOSE) {
                console.log('Start "' + test.test.testName + '"');
            }
            currentTests.push(test.test.testName);

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

        afterEach: function (test) {
            if (VERBOSE) {
                console.log('- end "' + test.test.testName + '"');
            }
            currentTests.splice(
                currentTests.indexOf(test.test.testName),
                1
            );

            var container = document.getElementById('container');
            container.innerHTML = '';

            var containerStyle = container.style;
            containerStyle.width = '';
            containerStyle.height = '';
            containerStyle.position = '';
            containerStyle.left = '';
            containerStyle.top = '';
            containerStyle.zIndex = '';
        }
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
