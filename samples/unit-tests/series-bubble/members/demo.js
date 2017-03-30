QUnit.test('directTouch', function (assert) {
    var bubbleSeries = Highcharts.seriesTypes.bubble;
    assert.strictEqual(
        bubbleSeries.prototype.directTouch,
        true,
        'directTouch should default to true.'
    );
    assert.strictEqual(
        bubbleSeries.prototype.noSharedTooltip,
        true,
        'noSharedTooltip should default to true.'
    );
});