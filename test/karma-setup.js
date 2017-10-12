/* global document, QUnit */
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
