QUnit.test('Defaults', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'gauge'
        },
        title: {
            text: 'Highcharts gauge defauls'
        },
        series: [{
            data: [27]
        }]
    });

    assert.strictEqual(
        chart.yAxis[0].min,
        0,
        'When no axis extremes are given, min should be 0'
    );

    assert.ok(
        chart.yAxis[0].max > 27,
        'When no axis extremes are given, max should be greater than data (1pt)'
    );

    chart.series[0].setData([27, 42]);

    assert.ok(
        chart.yAxis[0].max > 42,
        'When no axis extremes are given, max should be greater than data (2pt)'
    );
});
