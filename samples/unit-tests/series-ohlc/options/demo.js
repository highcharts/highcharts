QUnit.test('defaultOptions', function (assert) {
    var options = Highcharts.getOptions(),
        ohlc = options.plotOptions.ohlc;
    assert.strictEqual(
        ohlc.stickyTracking,
        true,
        'stickyTracking should default to true.'
    );
});

QUnit.test('Disabled options', function (assert) {
    var chart = Highcharts.stockChart('container', {
        series: [{
            type: 'ohlc'
        }, {
            type: 'ohlc',
            stacking: true
        }, {
            type: 'ohlc',
            stacking: 'percent'
        }, {
            type: 'ohlc',
            stacking: 'normal'
        }]
    });

    Highcharts.each(chart.series, function (series) {
        assert.strictEqual(
            series.options.stacking,
            false,
            'Stacking should be disabled (#8817)'
        );
    });
});