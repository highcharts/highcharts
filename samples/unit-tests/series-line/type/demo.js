QUnit.test('line-simple', function (assert) {

    ChartTemplate.test('line-simple', {}, function (template) {

        var chart = template.chart,
            options = chart.options;

        assert.strictEqual(
            options.chart.type,
            'line',
            'Chart type should be "line".'
        );

    }, assert.async());

});
