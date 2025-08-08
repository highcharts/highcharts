QUnit.test('directTouch', function (assert) {
    var bubbleSeries = Highcharts.Series.types.bubble;
    assert.strictEqual(
        bubbleSeries.prototype.noSharedTooltip,
        true,
        'noSharedTooltip should default to true.'
    );
});
