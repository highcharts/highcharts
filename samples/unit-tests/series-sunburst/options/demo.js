QUnit.test('defaultOptions', function (assert) {
    var options = Highcharts.getOptions(),
        sunburst = options.plotOptions.sunburst;
    assert.strictEqual(
        typeof sunburst,
        'object',
        'sunburst has default plot options'
    );
});