QUnit.test('tooltip', function (assert) {
    assert.strictEqual(
        Highcharts.Series.types.gauge.prototype.noSharedTooltip,
        true,
        'noSharedTooltip: true. #5354'
    );
});
