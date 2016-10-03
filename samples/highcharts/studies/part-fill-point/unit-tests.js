/**
 * Checks that the correct series types 'bar', 'column', 'columnrange', 'pie',
 * 'gauge' and 'solidgauge' are marked as supported.
 */
QUnit.test('supportsPartFill', function (assert) {
    var chart,
        supportedTypes = ['bar', 'column', 'columnrange'],
        someUnSupportedTypes = ['line', 'area', 'arearange', 'areaspline', 'bubble', 'funnel', 'pie', 'gauge', 'solidgauge'],
        type,
        i,
        chartOptions = {
            chart: {
                type: ''
            },
            series: [{
                data: [29.9, 71.5, 106.4]
            }]
        };

    // Check that each SUPPORTED series type is marked as supported
    for (i = 0; i < supportedTypes.length; i++) {
        type = supportedTypes[i];
        chartOptions.chart.type = type;
        $('#container').highcharts(chartOptions);
        chart = $('#container').highcharts();

        assert.equal(
            chart.series[0].supportsPartFill === true,
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
            chart.series[0].supportsPartFill === true,
            false,
            'Series type "' + type + '" is not marked as supported'
        );
    }

});
