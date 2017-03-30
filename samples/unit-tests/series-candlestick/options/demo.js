QUnit.test('defaultOptions', function (assert) {
    var options = Highcharts.getOptions(),
        candlestick = options.plotOptions.candlestick;
    assert.strictEqual(
        candlestick.stickyTracking,
        true,
        'stickyTracking should default to true.'
    );
});