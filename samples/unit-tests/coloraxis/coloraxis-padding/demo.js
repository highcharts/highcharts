QUnit.test('Color axis padding (#3379)', function (assert) {

    const chart = Highcharts.chart('container', {
        chart: {
            type: 'heatmap'
        },
        colorAxis: {
            min: -1,
            max: 1
        },

        series: [
            {
                data: [
                    [0, 0, -1],
                    [0, 1, 1]
                ]
            }
        ]
    });

    assert.strictEqual(chart.colorAxis[0].toPixels(-1), 0, 'No left padding');
});

QUnit.test('Color axis padding with long labels (#15551)', function (assert) {

    const chart = Highcharts.chart('container', {
        chart: {
            type: 'heatmap'
        },

        colorAxis: {
            min: -1,
            max: 1000000,
            labels: {
                format: '{value:.,.0f}'
            }
        },

        legend: {
            layout: 'vertical',
            align: 'right'
        },

        series: [
            {
                data: [
                    [0, 0, -1],
                    [0, 1, 1000000]
                ]
            }
        ]
    });

    const labelWidth = chart.series[0].colorAxis.legendItem.labelWidth,
        shortWidth = 50;

    assert.ok(
        labelWidth > shortWidth,
        'Long labels should get enough width (#15551).'
    );
});
