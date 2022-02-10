QUnit.test('Waterfall point definitions(#4094)', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'waterfall'
        },

        xAxis: {
            type: 'datetime'
        },

        series: [
            {
                data: [
                    [Date.UTC(2015, 0, 1), 20],
                    [Date.UTC(2015, 0, 2), -20],
                    [Date.UTC(2015, 0, 3), 5],
                    [Date.UTC(2015, 0, 4), 7]
                ]
            }
        ]
    });

    assert.strictEqual(
        chart.xAxis[0].dataMin,
        Date.UTC(2015, 0, 1),
        'X Axis min'
    );

    assert.strictEqual(
        chart.xAxis[0].dataMax,
        Date.UTC(2015, 0, 4),
        'X Axis max'
    );

    assert.strictEqual(
        chart.series[0].data[1].isInside,
        true,
        'The point.isInside flag should be true (#16788).'
    );
});
