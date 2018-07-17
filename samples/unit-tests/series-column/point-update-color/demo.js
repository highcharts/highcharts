QUnit.test(
    'Preserve point config initial number type in options.data',
    function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            series: [{
                data: [2, -2],
                color: 'red',
                negativeColor: 'yellow'
            }]
        });
        Highcharts.each(chart.series[0].data, function (p) {
            p.update({ color: 'blue' });
        });
        assert.strictEqual(
            chart.series[0].data[0].graphic.element.attributes.fill.value,
            'blue',
            'point update works correctly with positive number'
        );
        assert.strictEqual(
            chart.series[0].data[1].graphic.element.attributes.fill.value,
            'blue',
            'point update works correctly with negative number'
        );
    }
);
