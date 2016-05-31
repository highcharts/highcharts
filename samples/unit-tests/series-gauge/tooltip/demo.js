QUnit.test('tooltip', function (assert) {
    assert.strictEqual(
        Highcharts.seriesTypes.gauge.prototype.noSharedTooltip,
        true,
        'noSharedTooltip: true. #5354'
    );
});
