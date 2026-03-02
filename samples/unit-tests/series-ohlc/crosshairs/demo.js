QUnit.test('Crosshairs in OHLC', function (assert) {
    var chart = Highcharts.stockChart('container', {
        series: [
            {
                type: 'ohlc',
                data: [
                    [100, 102, 99, 101],
                    [101, 104, 100, 102],
                    [102, 104, 100, 101]
                ]
            }
        ],
        yAxis: {
            crosshair: {
                color: 'red'
            }
        }
    });

    var points = chart.series[0].points,
        yAxis = chart.yAxis[0];

    points[0].onMouseOver();

    assert.close(
        parseFloat(yAxis.cross.attr('d').split(' ')[2]),
        yAxis.toPixels(101),
        1,
        'Crosshair is placed on close value (#6562)'
    );
});

QUnit.test('Crosshair label formatter gets ctx in arrow callback', function (
    assert
) {
    var formatterCtx,
        chart = Highcharts.stockChart('container', {
            series: [
                {
                    type: 'ohlc',
                    data: [
                        [100, 102, 99, 101],
                        [101, 104, 100, 102],
                        [102, 104, 100, 101]
                    ]
                }
            ],
            yAxis: {
                crosshair: {
                    label: {
                        enabled: true,
                        formatter: (value, ctx) => {
                            formatterCtx = ctx;
                            return 'v=' + value;
                        }
                    }
                }
            }
        }),
        points = chart.series[0].points;

    points[0].onMouseOver();

    assert.strictEqual(
        formatterCtx,
        chart.yAxis[0],
        'Crosshair formatter received axis ctx as the last argument'
    );
});
