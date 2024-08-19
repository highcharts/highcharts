QUnit.test('Extremes are calculated from all series. #6209', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'heatmap'
        },
        colorAxis: {},
        series: [
            {
                data: [
                    [0, 1, 0],
                    [1, 2, 1]
                ]
            },
            {
                data: [
                    [3, 1, 100],
                    [4, 2, 600]
                ]
            }
        ]
    });

    assert.strictEqual(chart.colorAxis[0].max, 600, 'Max is 600');
    assert.strictEqual(chart.colorAxis[0].min, 0, 'Min is 0');
});

QUnit.test('Color not lost after extreme change, #17945', function (assert) {
    const chart = Highcharts.stockChart('container', {
        chart: {
            type: 'line'
        },
        colorAxis: {
            stops: [
                [0.25, 'red'],
                [0.50, 'green'],
                [1, 'blue']
            ]
        },
        series: [{
            dataGrouping: {
                enabled: true,
                groupPixelWidth: 15,
                units: [
                    [
                        'week',
                        [1]
                    ]
                ]
            },
            pointStart: Date.UTC(2020, 4, 28, 2),
            pointInterval: 36e5 * 24,
            data: [
                5.217, 4.881, 5.574, 6.948, 6.697, 6.81, 7.114, 6.326, 6.36,
                6.9, 6.8, 6.41, 6.75, 7.002, 6.683, 5.6, 5.92, 6.36, 6.49, 6.18,
                6.31, 6.356, 6.29, 5.75, 5.34, 5.292, 5.627, 5.381, 5.49, 5.484,
                6.076, 6.1, 5.959, 5.873, 5.689, 5.453, 5.69, 5.6, 5.83, 5.913,
                5.601, 5.515, 5.26, 4.463, 4.325, 4.274, 4.41, 4.222, 4.387,
                4.361, 4.272, 4.425, 5.015, 5.029, 4.773, 4.922, 4.956, 4.868
            ],
            marker: {
                enabled: true,
                radius: 10
            }
        }]
    });

    const series = chart.series[0],
        color = series.groupedData[0].color;

    chart.rangeSelector.clickButton(0);
    chart.rangeSelector.clickButton(5);

    assert.strictEqual(
        series.groupedData[0].color,
        color,
        'Marker colors should not change after going back to the grouped state.'
    );
});
