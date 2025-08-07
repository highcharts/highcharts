QUnit.test('directTouch', function (assert) {
    var bubbleSeries = Highcharts.Series.types.bubble;
    assert.strictEqual(
        bubbleSeries.prototype.noSharedTooltip,
        false,
        'noSharedTooltip should default to false.'
    );
});
