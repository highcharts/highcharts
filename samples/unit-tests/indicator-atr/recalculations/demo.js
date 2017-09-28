
QUnit.test('Test algorithm on data updates.', function (assert) {

    var chart = Highcharts.stockChart('container', {
        series: [{
            id: 'main',
            type: 'ohlc',
            data: [
                [48.5, 48.70, 47.79, 48.16],
                [48.5, 48.72, 48.14, 48.61],
                [48.5, 48.90, 48.39, 48.75],
                [48.5, 48.87, 48.37, 48.63],
                [48.5, 48.82, 48.24, 48.74],
                [48.5, 49.05, 48.64, 49.03],
                [48.5, 49.20, 48.94, 49.07],
                [48.5, 49.35, 48.86, 49.32],
                [48.5, 49.92, 49.50, 49.91],
                [48.5, 50.19, 49.87, 50.13],
                [48.5, 50.12, 49.20, 49.53],
                [48.5, 49.66, 48.90, 49.50],
                [48.5, 49.88, 49.43, 49.75],
                [48.5, 50.19, 49.73, 50.03],
                [48.5, 50.36, 49.26, 50.31],
                [48.5, 50.57, 50.09, 50.52],
                [48.5, 50.65, 50.30, 50.41]
            ]
        }, {
            type: 'atr',
            linkedTo: 'main'
        }]
    });

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.period - 1,
        'Initial number of ATR points is correct'
    );

    assert.deepEqual(
        chart.series[1].yData,
        [0.5615384615384619, 0.6000000000000004, 0.5914285714285715, 0.5741836734693878],
        'Correct values'
    );

    chart.series[0].addPoint([48.5, 50.43, 49.21, 49.34]);

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.period - 1,
        'After addPoint number of ATR points is correct'
    );

    chart.series[0].setData([
        [48.5, 49.63, 48.98, 49.37],
        [48.5, 50.33, 49.61, 50.23],
        [48.5, 50.29, 49.20, 49.24],
        [48.5, 50.17, 49.43, 49.93],
        [48.5, 49.32, 48.08, 48.43],
        [48.5, 48.50, 47.64, 48.18],
        [48.5, 48.32, 41.55, 46.57],
        [48.5, 46.80, 44.28, 45.41]
    ], false);

    chart.series[1].update({
        color: 'red',
        params: {
            period: 4
        }
    });

    assert.deepEqual(
        chart.series[1].yData,
        [0.9000000000000009, 1.137500000000001, 1.0681250000000007, 2.4935937500000014, 2.5001953125],
        'Correct values'
    );

    assert.strictEqual(
        chart.series[1].graph.attr('stroke'),
        'red',
        'Line color changed'
    );

    chart.series[0].points[2].remove();

    assert.deepEqual(
        chart.series[1].yData,
        [0.8033333333333346, 0.8175000000000008, 2.3056250000000014, 2.35921875],
        'Correct values after point.remove()'
    );
});
