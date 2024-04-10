QUnit.test('Flags on the chart', function (assert) {
    var chart = new Highcharts.Chart('container', {
        chart: {
            type: 'spline'
        },
        series: [
            {
                data: [10, 20, 30, 10, 20, 30],
                id: 'main'
            },
            {
                type: 'flags',
                data: [
                    {
                        x: 3
                    }
                ]
            },
            {
                type: 'flags',
                onSeries: 'main',
                data: [
                    {
                        x: 1.75
                    },
                    {
                        x: 3
                    }
                ]
            }
        ]
    });

    assert.close(
        chart.series[2].points[0].y,
        29.14,
        0.5,
        'Flag properly placed on the spline series curve (#19264)'
    );

    chart.update({
        chart: {
            inverted: true,
            type: 'line'
        }
    });

    assert.strictEqual(
        chart.series[1].points[0].plotX,
        0,
        'Flag properly placed on xAxis of the inverted chart (#4960)'
    );

    assert.strictEqual(
        chart.series[2].points[1].plotX,
        chart.yAxis[0].toPixels(chart.series[0].points[3].y, true),
        'Flag properly placed on xAxis of the inverted chart (#4960)'
    );
});

QUnit.test('Positioning of flags on yAxis', function (assert) {
    var top = 80,
        chart = $('#container')
            .highcharts('StockChart', {
                yAxis: {
                    top: top,
                    height: '20%'
                },
                series: [
                    {
                        data: [10, 20, 15, 13, 15, 11, 15]
                    },
                    {
                        type: 'flags',
                        data: [
                            {
                                x: 5,
                                title: 5
                            }
                        ]
                    }
                ]
            })
            .highcharts();

    assert.strictEqual(
        chart.series[1].points[0].plotY,
        chart.yAxis[0].len,
        'The flag should be placed on the bottom of its yAxis'
    );
});

QUnit.test('#2049 - Flag series on grouped columns.', function (assert) {
    var chart = Highcharts.stockChart('container', {
            chart: {
                type: 'column'
            },
            series: [
                {
                    data: [
                        [0, 50.245666000100002],
                        [1, 22.0]
                    ],
                    id: 'left'
                },
                {
                    data: [
                        [0, 55.0],
                        [1, 22.0]
                    ],
                    id: 'right'
                },
                {
                    data: [
                        {
                            x: 0
                        },
                        {
                            x: 1
                        }
                    ],
                    onSeries: 'left',
                    type: 'flags'
                },
                {
                    data: [
                        {
                            x: 0
                        },
                        {
                            x: 1
                        }
                    ],
                    onSeries: 'right',
                    type: 'flags'
                }
            ]
        }),
        series,
        xOffset;

    [0, 1].forEach(i => {
        series = chart.series[i];
        xOffset = series.pointXOffset + series.barW / 2;
        series.points.forEach((point, j) => {
            assert.strictEqual(
                Math.round(point.plotX + xOffset),
                Math.round(chart.series[i + 2].points[j].plotX),
                'Flag ' +
                    j +
                    ' from series ' +
                    chart.series[i + 2].name +
                    ' matches corresponding column.'
            );
        });
    });
});
