QUnit.test('Test algorithm on data updates.', function (assert) {
    var chart = Highcharts.stockChart('container', {
        series: [
            {
                id: 'main',
                type: 'ohlc',
                data: [
                    [51, 53, 51, 52],
                    [51, 53, 51, 51],
                    [51, 53, 51, 51.5],
                    [51, 53, 51, 48.5],
                    [51, 53, 51, 53],
                    [51, 53, 51, 53.5],
                    [51, 53, 51, 53.5]
                ]
            },
            {
                type: 'momentum',
                linkedTo: 'main',
                params: {
                    period: 5
                }
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.period,
        'Initial number of Momentum points is correct'
    );

    assert.deepEqual(
        chart.series[1].getColumn('y'), [1.5, 2.5], 'Correct values'
    );

    chart.series[0].addPoint([51, 53, 51, 55]);

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.period,
        'After addPoint number of Momentum points is correct'
    );

    chart.series[0].setData(
        [
            [51, 53, 51, 54],
            [51, 53, 51, 53],
            [51, 53, 51, 52.5],
            [51, 53, 51, 50.5],
            [51, 53, 51, 54]
        ],
        false
    );

    chart.series[1].update({
        color: 'red',
        params: {
            period: 3
        }
    });

    assert.deepEqual(
        chart.series[1].getColumn('y'), [-3.5, 1], 'Correct values'
    );

    assert.strictEqual(
        chart.series[1].graph.attr('stroke'),
        'red',
        'Line color changed'
    );

    chart.series[0].points[2].remove();

    assert.deepEqual(
        chart.series[1].getColumn('y'),
        [0],
        'Correct values after point.remove()'
    );
});
