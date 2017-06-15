QUnit.test('directTouch', function (assert) {
    var ohlcSeries = Highcharts.seriesTypes.ohlc;
    assert.strictEqual(
        ohlcSeries.prototype.directTouch,
        false,
        'directTouch should default to false.'
    );
});