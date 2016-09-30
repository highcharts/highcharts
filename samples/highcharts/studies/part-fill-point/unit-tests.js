/**
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

    var result = number === expected || (number < expected + error && number > expected - error) || false;

    QUnit.push(result, number, expected, message);
};

/**
 * Checks that the correct series types 'bar', 'column', 'columnrange', 'pie',
 * 'gauge' and 'solidgauge' are marked as supported.
 */
QUnit.test('isPartFillSupported()', function (assert) {
    var chart,
        supportedTypes = ['bar', 'column', 'columnrange', 'pie', 'gauge', 'solidgauge'],
        someUnSupportedTypes = ['line', 'area', 'arearange', 'areaspline', 'boxplot', 'bubble', 'errorbar', 'funnel'],
        type,
        i,
        chartOptions = {
            chart: {
                type: ''
            },
            series: [{
                data: [129.9, 271.5, 306.4, -29.2, 544.0, 376.0, 435.6, 348.5, 216.4, 294.1, 35.6, 354.4]
            }]
        };

    // Check that each SUPPORTED series type is marked as supported
    for (i = 0; i < supportedTypes.length; i++) {
        type = supportedTypes[i];
        chartOptions.chart.type = type;
        $('#container').highcharts(chartOptions);
        chart = $('#container').highcharts();

        assert.equal(
            chart.series[0].isPartFillSupported(),
            true,
            'Series type "' + type + '" is marked as supported'
        );
    }

    // Check that each UNSUPPORTED series type is marked as unsupported
    for (i = 0; i < someUnSupportedTypes.length; i++) {
        type = someUnSupportedTypes[i];
        chartOptions.chart.type = type;
        $('#container').highcharts(chartOptions);
        chart = $('#container').highcharts();

        assert.equal(
            chart.series[0].isPartFillSupported(),
            false,
            'Series type "' + type + '" is not marked as supported'
        );
    }

});
