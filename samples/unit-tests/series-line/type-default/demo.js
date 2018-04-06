QUnit.test('series-line/type-default', function (assert) {

    ChartTemplate.test('line-simple', {

        chart: {
            type: undefined
        }

    }, function (template) {

        var chart = template.chart,
            options = chart.options,
            series = chart.series[0];

        assert.strictEqual(
            options.chart.type,
            undefined,
            'Chart type option should be undefined.'
        );

        assert.strictEqual(
            series.type,
            'line',
            'Series type should be "line" as default.'
        );

    }, assert.async());

});
