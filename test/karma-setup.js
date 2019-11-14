/* eslint-env browser */
/* eslint-disable */
/* global __karma__, Highcharts, Promise, QUnit */

/**
 * This file runs in the browser as setup for the karma tests.
 */

var VERBOSE = false;

var CANVAS_WIDTH = 600;
var CANVAS_HEIGHT = 400;

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
canvas.setAttribute('width', CANVAS_WIDTH);
canvas.setAttribute('height', CANVAS_HEIGHT);
var ctx = canvas.getContext && canvas.getContext('2d');

var currentTests = [];

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
            },
            states: {
                hover: {
                    animation: false
                },
                select: {
                    animation: false
                },
                inactive: {
                    animation: false
                },
                normal: {
                    animation: false
                }
            }
        },
        // We cannot use it in plotOptions.series because treemap
        // has the same layout option: layoutAlgorithm.
        networkgraph: {
            layoutAlgorithm: {
                enableSimulation: false,
                maxIterations: 10
            }
        },
        packedbubble: {
            layoutAlgorithm: {
                enableSimulation: false,
                maxIterations: 10
            }
        }

    },
    // Stock's Toolbar decreases width of the chart. At the same time, some
    // tests have hardcoded x/y positions for events which cuases them to fail.
    // For these tests, let's disable stockTools.gui globally.
    stockTools: {
        gui: {
            enabled: false
        }
    },
    tooltip: {
        animation: false
    }
});
// Save default functions from the default options, as they are not stringified
// to JSON
/*
function handleDefaultOptionsFunctions(save) {
    var defaultOptionsFunctions = {};
    function saveDefaultOptionsFunctions(original, path) {
        Highcharts.objectEach(original, function (value, key) {
            if (
                Highcharts.isObject(value, true) &&
                !Highcharts.isClass(value) &&
                !Highcharts.isDOMElement(value)
            ) {
                // Recurse
                saveDefaultOptionsFunctions(original[key], (path ? path + '.' : '') + key);

            } else if (save && typeof value === 'function') {
                defaultOptionsFunctions[path + '.' + key] = value;

            } else if ( // restore
                !save &&
                typeof value === 'function'
            ) {
                console.log('restore', path + '.' + key)
                original[key] = defaultOptionsFunctions[path + '.' + key];
            }
        });
    }
    saveDefaultOptionsFunctions(Highcharts.defaultOptions, '');
}
handleDefaultOptionsFunctions(true);
*/
Highcharts.defaultOptionsRaw = JSON.stringify(Highcharts.defaultOptions);
Highcharts.callbacksRaw = Highcharts.Chart.prototype.callbacks.slice(0);

// Override Highcharts and jQuery ajax functions to load from local
Highcharts.wrap(Highcharts, 'ajax', function (proceed, attr) {
    var success = attr.success;
    attr.error = function (e) {
        throw new Error('Failed to load: ' + attr.url);
    };
    if (attr.url && window.JSONSources[attr.url]) {
        success.call(attr, window.JSONSources[attr.url]);
    } else {
        console.log('@ajax: Loading over network', attr.url);
        attr.success = function (data) {
            window.JSONSources[attr.url] = data;
            success.call(this, data);
        };
        return proceed.call(this, attr);
    }
});
if (window.$) {
    $.getJSON = function (url, callback) { // eslint-disable-line no-undef
        callback(window.JSONSources[url]);
    };
}

function resetDefaultOptions(testName) {

    var defaultOptionsRaw = JSON.parse(Highcharts.defaultOptionsRaw);

    // Before running setOptions, delete properties that are undefined by
    // default. For example, in `highcharts/members/setoptions`, properties like
    // chart.borderWidth and chart.plotBorderWidth are set. The default options
    // don't contain these props, so a simple merge won't remove them.
    function deleteAddedProperties(copy, original) {
        Highcharts.objectEach(copy, function (value, key) {
            if (
                Highcharts.isObject(value, true) &&
                Highcharts.isObject(original[key], true) &&
                !Highcharts.isClass(value) &&
                !Highcharts.isDOMElement(value)
            ) {
                // Recurse
                deleteAddedProperties(copy[key], original[key]);
            } else if (
                // functions are not saved in defaultOptionsRaw
                typeof value !== 'function' &&
                !(key in original)
            ) {
                delete copy[key];
            }
        });
    }

    deleteAddedProperties(Highcharts.defaultOptions, defaultOptionsRaw);

    // Delete functions (not automated as they are not serialized in JSON)
    delete Highcharts.defaultOptions.global.getTimezoneOffset;
    delete Highcharts.defaultOptions.time.getTimezoneOffset;

    Highcharts.setOptions(defaultOptionsRaw);

    // Create a new Time instance to avoid state leaks related to time and the
    // legacy global options
    Highcharts.time = new Highcharts.Time(Highcharts.merge(
        Highcharts.defaultOptions.global,
        Highcharts.defaultOptions.time
    ));
}


// Handle wrapping, reset functions that are wrapped in the visual samples to
// prevent the wraps from piling up downstream.
var origWrap = Highcharts.wrap;
var wrappedFunctions = [];
var origAddEvent = Highcharts.addEvent;
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

    //QUnit.config.seed = 'vaolebrok';
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
        // Remove fix of number localization in IE
        if (
            /msie/.test(navigator.userAgent) &&
            Number.prototype._toString
        ) {
            Number.prototype.toString = Number.prototype._toString;
            delete Number.prototype._toString;
        }

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

            // Wrap the wrap function
            Highcharts.wrap = function (ob, prop, fn) {
                // Push original function
                wrappedFunctions.push([ob, prop, ob[prop]]);
                origWrap(ob, prop, fn);
            };

            // Wrap the addEvent function
            Highcharts.addEvent = function (el, type, fn, options) {
                var unbinder = origAddEvent(el, type, fn, options);

                if (typeof el === 'function' && el.prototype) {
                    addedEvents.push(unbinder);
                }
                return unbinder;
            }
        },

        afterEach: function (test) {
            if (VERBOSE) {
                console.log('- end "' + test.test.testName + '"');
            }
            currentTests.splice(
                currentTests.indexOf(test.test.testName),
                1
            );

            var defaultOptions = JSON.stringify(Highcharts.defaultOptions);
            if (defaultOptions !== Highcharts.defaultOptionsRaw) {
                //var msg = 'Default options changed, make sure the test resets options';
                //console.log(test.test.testName, msg);
                //QUnit.config.queue.length = 0;
                //throw new Error(msg);
            }

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
                    currentChart.renderer.box.isTemplate = true;
                } else if (currentChart.destroy && currentChart.renderer) {
                    currentChart.destroy();
                }
            }

            Highcharts.charts.length = 0;
            Array.prototype.push.apply(Highcharts.charts, templateCharts);

            // Renderer samples, no chart instance existed
            var svgs = document.getElementsByTagName('svg'),
                i = svgs.length;
            while (i--) {
                if (!svgs[i].isTemplate) {
                    svgs[i].parentNode.removeChild(svgs[i]);
                }
            }

            // Unwrap/reset wrapped functions
            while (wrappedFunctions.length) {
                //const [ ob, prop, fn ] = wrappedFunctions.pop();
                var args = wrappedFunctions.pop(),
                    ob = args[0],
                    prop = args[1],
                    fn = args[2];
                ob[prop] = fn;
            }
            Highcharts.wrap = origWrap;

            // Unbind events and reset addEvent
            while (addedEvents.length) {
                addedEvents.pop()();
            }
            Highcharts.addEvent = origAddEvent;


            // Reset defaultOptions and callbacks if those are mutated. In
            // karma-konf, the scriptBody is inspected to see if these expensive
            // operations are necessary. Visual tests only.
            if (test.test.resets && test.test.resets.forEach) {
                test.test.resets.forEach(function (key) {
                    var fn = {
                        callbacks: function () {
                            Highcharts.Chart.prototype.callbacks =
                                Highcharts.callbacksRaw.slice(0);
                        },
                        defaultOptions: function () {
                            resetDefaultOptions(test.test.testName);
                        }
                    };
                    fn[key]();
                });
            }
        }
    });
}

/*
 * Display the tooltip so it gets part of the comparison
 */
Highcharts.prepareShot = function (chart) {
    if (
        chart &&
        chart.series &&
        chart.series[0]
    ) {
        var points = chart.series[0].nodes || // Network graphs, sankey etc
            chart.series[0].points;

        if (points) {
            for (var i = 0; i < points.length; i++) {
                if (
                    points[i] &&
                    !points[i].isNull &&
                    !( // Map point with no extent, like Aruba
                        points[i].shapeArgs &&
                        points[i].shapeArgs.d &&
                        points[i].shapeArgs.d.length === 0
                    ) &&
                    typeof points[i].onMouseOver === 'function'
                ) {
                    points[i].onMouseOver();
                    break;
                }
            }
        }
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
        svg = container.querySelector('svg')
            .outerHTML
            .replace(
                /<svg /,
                '<svg xmlns:xlink="http://www.w3.org/1999/xlink" '
            );

        if (chart.styledMode) {
            svg = svg.replace(
                '</style>',
                '* { fill: rgba(0, 0, 0, 0.1); stroke: black; stroke-width: 1px; } '
                + 'text, tspan { fill: blue; stroke: none; } </style>'
            );
        }

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
 * Vanilla request for fetching an url using GET.
 * @param {String} url to fetch
 * @param {Function} callback to call when done.
 */
function xhrLoad(url, callback) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            callback(xhr);
        }
    };
    xhr.open('GET', url, true);
    xhr.send();
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

                // Invalidate images, loading external images will throw an
                // error
                svg = svg.replace(/xlink:href/g, 'data-href');

                var img = new Image(),
                    blob = new Blob([svg], { type: 'image/svg+xml' }),
                    url = DOMURL.createObjectURL(blob);
                img.onload = function () {
                    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                    ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                    callback(ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data);
                };
                img.onerror = function () {
                    // console.log(svg)
                    reject(
                        new Error('Error loading SVG on canvas.')
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
                        canvasWidth: CANVAS_WIDTH,
                        canvasHeight: CANVAS_HEIGHT,
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
            reject(new Error('No candidate SVG found'));
        }

        var remotelocation = __karma__.config.cliArgs && __karma__.config.cliArgs.remotelocation;
        // Handle reference, load SVG from bucket or file
        var url = 'base/samples/' + path + '/reference.svg';
        if (remotelocation) {
            url = 'http://' + remotelocation + '.s3.eu-central-1.amazonaws.com/visualtests/reference/latest/' + path + '/reference.svg';
        }
        xhrLoad(url, function onXHRDone(xhr) {
            if (xhr.status == 200) {
                var svg = xhr.responseText;
                svgToPixels(svg, function (data) {
                    referenceData = data;
                    doComparison();
                })
            } else {
                console.log('No reference.svg for test ' + path + ' found. Skipping comparison.'
                + ' Status returned is ' + xhr.status + ' ' + xhr.statusText + '.');
                resolve();
            }
        });
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
