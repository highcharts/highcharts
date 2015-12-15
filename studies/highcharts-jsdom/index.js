/**
 * Node script to generate an SVG chart without a browser like PhantomJS.
 */

/* global console, require */
/* eslint no-console: 0, no-nested-ternary: 0 */
var jsdom = require('jsdom'),
    fs = require('fs');

var doc = jsdom.jsdom('<!doctype html><html><body><div id="container"></div></body></html>'),
    win = doc.defaultView;

doc.createElementNS = function (ns, tagName) {
    var elem = doc.createElement(tagName);

    /**
     * Pass Highcharts' test for SVG capabilities
     * @returns {undefined}
     */
    elem.createSVGRect = function () {};
    /**
     * jsdom doesn't compute layout (see https://github.com/tmpvar/jsdom/issues/135).
     * This getBBox implementation provides just enough information to get Highcharts
     * to render text boxes correctly, and is not intended to work like a general
     * getBBox implementation. The height of the boxes are computed from the sum of
     * tspans and their font sizes. The width is based on an average width for each glyph.
     * One way to improve this could be to create a map over glyph widths for several
     * fonts and sizes, but it may not be necessary for the purpose.
     * @returns {Object} The bounding box
     */
    elem.getBBox = function () {
        var lineWidth = 0,
            width = 0,
            height = 0;

        [].forEach.call(elem.children.length ? elem.children : [elem], function (child) {
            var fontSize = child.style.fontSize || elem.style.fontSize,
                lineHeight,
                textLength;

            // The font size and lineHeight is based on empirical values, copied from
            // the SVGRenderer.fontMetrics function in Highcharts.
            fontSize = /px/.test(fontSize) ? parseInt(fontSize, 10) : /em/.test(fontSize) ? parseFloat(fontSize) * 12 : 12;
            lineHeight = fontSize < 24 ? fontSize + 3 : Math.round(fontSize * 1.2);
            textLength = child.textContent.length * fontSize * 0.55;

            // Tspans on the same line
            if (child.getAttribute('dx') !== '0') {
                height += lineHeight;
            }

            // New line
            if (child.getAttribute('dy') !== null) {
                lineWidth = 0;
            }

            lineWidth += textLength;
            width = Math.max(width, lineWidth);

        });

        return {
            x: 0,
            y: 0,
            width: width,
            height: height
        };
    };
    return elem;
};

var Highcharts = require('../../js/highcharts.src')(win);

// Disable all animation
Highcharts.setOptions({
    plotOptions: {
        series: {
            animation: false,
            dataLabels: {
                defer: false
            }
        }
    }
});

Highcharts.chart('container', {
    chart: {
        type: 'column',
        width: 600,
        height: 400,
        forExport: true
    },
    title: {
        text: 'Highcharts and jsdom'
    },
    subtitle: {
        text: 'This chart is generated <em>without</em> a browser'
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    yAxis: {
        title: {
            text: 'Rainfall / mm'
        }
    },

    plotOptions: {
        series: {
            dataLabels: {
                shape: 'callout',
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                style: {
                    color: '#FFFFFF',
                    textShadow: 'none'
                }
            }
        }
    },

    series: [{
        name: 'Monthly rainfall',
        data: [{
            y: 29.9,
            dataLabels: {
                enabled: true,
                format: 'January<br><span style="font-size: 1.3em">Dryest</span>',
                // format: 'Dryest',
                verticalAlign: 'bottom',
                y: -10
            }
        }, {
            y: 71.5
        }, {
            y: 106.4
        }, {
            y: 129.2
        }, {
            y: 144.0
        }, {
            y: 176.0
        }, {
            y: 135.6
        }, {
            y: 148.5
        }, {
            y: 216.4,
            dataLabels: {
                enabled: true,
                format: 'September<br><span style="font-size: 1.3em">Wettest</span>',
                // format: 'Wettest',
                align: 'right',
                verticalAlign: 'middle',
                x: -35
            }
        }, {
            y: 194.1
        }, {
            y: 95.6
        }, {
            y: 54.4
        }]
    }]
});

var svg = doc.getElementById('container').innerHTML;
fs.writeFile('chart.svg', svg, function () {
    console.log('Wrote ' + svg.length + ' bytes to chart.svg.');
});
