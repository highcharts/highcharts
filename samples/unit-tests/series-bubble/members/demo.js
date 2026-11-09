QUnit.test('Shared tooltip', function (assert) {
    var bubbleSeries = Highcharts.Series.types.bubble;
    assert.notOk(
        bubbleSeries.prototype.noSharedTooltip,
        'Bubble series should support shared tooltips.'
    );
});
