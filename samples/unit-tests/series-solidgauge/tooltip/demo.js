QUnit.test('tooltip', function (assert) {
    assert.strictEqual(
        Highcharts.seriesTypes.solidgauge.prototype.noSharedTooltip,
        true,
        'noSharedTooltip: true. #5354'
    );
});
