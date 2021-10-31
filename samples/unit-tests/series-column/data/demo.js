QUnit.test('Zero column visible (#5146)', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [
            {
                type: 'column',
                borderWidth: 0,
                data: [0, -1, -2, -3, -4]
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].points[0].graphic.attr('height'),
        0,
        'No height'
    );
});

QUnit.test(
    '#14315: Setting extremes that contained no data threw',
    (assert) => {
        const chart = Highcharts.chart('container', {
            chart: {
                type: 'column',
                animation: false
            },
            series: [
                {
                    data: [
                        49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5,
                        216.4, 194.1, 95.6, 54.4
                    ]
                }
            ]
        });

        chart.xAxis[0].setExtremes(-10, -5);

        assert.ok(true, 'Setting extremes should not throw');
    }
);
