QUnit.test('series-line/type', function (assert) {

    ChartTemplate.test('line-simple', {}, function (template) {

        var chart = template.chart,
            options = chart.options,
            series = chart.series[0];

        assert.strictEqual(
            options.chart.type,
            'line',
            'Chart type option should be "line".'
        );

        assert.strictEqual(
            series.type,
            'line',
            'Series type should be "line".'
        );

    }, assert.async());

});
