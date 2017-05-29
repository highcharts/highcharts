QUnit.test('defaultOptions', function (assert) {
    var options = Highcharts.getOptions(),
        ohlc = options.plotOptions.ohlc;
    assert.strictEqual(
        ohlc.stickyTracking,
        true,
        'stickyTracking should default to true.'
    );
});