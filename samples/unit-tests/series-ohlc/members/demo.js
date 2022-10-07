QUnit.test('directTouch', function (assert) {
    var ohlcSeries = Highcharts.Series.types.ohlc;
    assert.strictEqual(
        ohlcSeries.prototype.directTouch,
        false,
        'directTouch should default to false.'
    );
});
