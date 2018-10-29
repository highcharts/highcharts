QUnit.module('defaultOptions', function () {
    var options = Highcharts.getOptions(),
        treemap = options.plotOptions.treemap;

    QUnit.test('dataLabels', function (assert) {
        assert.strictEqual(
            typeof treemap.dataLabels,
            'object',
            'should have dataLabels default to object.'
        );
        assert.strictEqual(
            treemap.dataLabels.align,
            'center',
            'should have dataLabels.align default to "center".'
        );
        assert.strictEqual(
            treemap.dataLabels.defer,
            false,
            'should have dataLabels.defer default to false.'
        );
        assert.strictEqual(
            treemap.dataLabels.enabled,
            true,
            'should have dataLabels.enabled default to true.'
        );
        assert.strictEqual(
            treemap.dataLabels.format,
            '{point.name}',
            'should have dataLabels.format default to "{point.name}".'
        );
        assert.strictEqual(
            treemap.dataLabels.inside,
            true,
            'should have dataLabels.inside default to true.'
        );
        assert.strictEqual(
            treemap.dataLabels.verticalAlign,
            'middle',
            'should have dataLabels.verticalAlign default to "middle".'
        );
    });
});
