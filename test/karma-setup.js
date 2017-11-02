/* eslint-env browser */
/* global Highcharts, Promise, QUnit */
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
        document.getElementById('container').style.width = 'auto';
        document.getElementById('container').style.width = 'auto';
    }
});

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
 * Get a PNG image or image data from the chart SVG.
 * @param   {Object} chart The chart instance
 * @param   {String} type  What to return, 'png' or 'data'
 * @returns {String}       The image data
 */
function getImage(chart, type) { // eslint-disable-line no-unused-vars
    return new Promise((resolve, reject) => {

        if (chart) {
            let container = chart && chart.container;
            try {

                Highcharts.prepareShot(chart);

                const data = container.querySelector('svg').outerHTML;
                const DOMURL = window.URL || window.webkitURL || window;

                const img = new Image();
                const svg = new Blob([data], { type: 'image/svg+xml' });
                const url = DOMURL.createObjectURL(svg);
                img.onload = function () {

                    ctx.drawImage(img, 0, 0, 300, 200);

                    if (type === 'png') {
                        DOMURL.revokeObjectURL(url);
                        const pngImg = canvas.toDataURL('image/png');
                        resolve(pngImg);
                    } else {
                        const imageData = ctx.getImageData(0, 0, 300, 200).data;
                        resolve(imageData);
                    }
                };
                img.onerror = function () {
                    reject('Error loading SVG on canvas.');
                };
                img.src = url;
            } catch (e) {
                reject(e.message);
            }
        } else {
            reject('No chart given');
        }
    });

}
