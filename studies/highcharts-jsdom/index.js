/**
 * Sample of serverside generation of Highcharts using an extension to jsdom.
 *
 * Usage: node index
 */

/* eslint-env node */
/* eslint no-console: 0 */
var jsdom = require('./highcharts-jsdom'),
    fs = require('fs');

// Get the document and window
var doc = jsdom.jsdom('<!doctype html><html><body><div id="container"></div></body></html>'),
    win = doc.defaultView;

// Require Highcharts with the window shim
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

// Generate the chart into the container
Highcharts.chart('container', {
    chart: {
        type: 'column',
        width: 600,
        height: 400
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

/* A small label test
var ren = new Highcharts.Renderer(
        win.document.getElementById('container'),
        600,
        400
    ),
    text,
    box,
    x,
    y = 20;

[8, 10, 12, 14, 16, 18, 20].forEach(function (fontSize) {
    x = 10;
    y = y += Math.round(fontSize * 1.8);
    text = ren.text('The quick brown fox', x, y)
        .css({
            fontSize: fontSize + 'px'
        })
        .add();
    box = text.getBBox();
    ren.rect(x - 0.5, y + 2.5 - box.height, box.width, box.height)
        .attr({
            'fill': 'none',
            'stroke': 'blue',
            'stroke-width': 1
        })
        .add();
});
*/





var svg = win.document.getElementById('container').innerHTML;
fs.writeFile('chart.svg', svg, function () {
    console.log('Wrote ' + svg.length + ' bytes to ' + __dirname + '/chart.svg.'); // eslint-disable-line no-path-concat
});
