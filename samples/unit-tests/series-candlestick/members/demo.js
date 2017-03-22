QUnit.test('directTouch', function (assert) {
    var candlestickSeries = Highcharts.seriesTypes.candlestick;
    assert.strictEqual(
        candlestickSeries.prototype.directTouch,
        false,
        'directTouch should default to false.'
    );
});