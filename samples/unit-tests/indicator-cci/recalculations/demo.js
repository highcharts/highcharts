
QUnit.test('Test algorithm on data updates.', function (assert) {

    var chart = Highcharts.stockChart('container', {
        series: [{
            id: 'main',
            type: 'ohlc',
            data: [
                [0, 23.94, 24.20, 23.85, 23.89],
                [1, 23.85, 24.07, 23.72, 23.95],
                [2, 23.94, 24.04, 23.64, 23.67],
                [3, 23.73, 23.87, 23.37, 23.78],
                [4, 23.60, 23.67, 23.46, 23.50],
                [5, 23.46, 23.59, 23.18, 23.32],
                [6, 23.53, 23.80, 23.40, 23.75],
                [7, 23.73, 23.80, 23.57, 23.79],
                [8, 24.09, 24.30, 24.05, 24.14],
                [9, 23.95, 24.15, 23.77, 23.81],
                [10, 23.92, 24.05, 23.60, 23.78],
                [11, 24.04, 24.06, 23.84, 23.86],
                [12, 23.83, 23.88, 23.64, 23.70],
                [13, 24.05, 25.14, 23.94, 24.96],
                [14, 24.89, 25.20, 24.74, 24.88],
                [15, 24.95, 25.07, 24.77, 24.96],
                [16, 24.91, 25.22, 24.90, 25.18],
                [17, 25.24, 25.37, 24.93, 25.07],
                [18, 25.13, 25.36, 24.96, 25.27],
                [19, 25.26, 25.26, 24.93, 25.00],
                [20, 24.74, 24.82, 24.21, 24.46],
                [21, 24.36, 24.44, 24.21, 24.28]
            ]
        }, {
            type: 'cci',
            linkedTo: 'main',
            params: {
                period: 20
            }
        }]
    });

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.period - 1,
        'Initial number of CCI points is correct'
    );

    // console.log(chart.series[1].yData);

    assert.deepEqual(
        chart.series[1].yData,
        [102.19852632840085, 30.770139381053642, 6.498977012877848],
        'Correct values'
    );

    chart.series[0].addPoint([22, 24.49, 24.65, 24.43, 24.62]);

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.period - 1,
        'After addPoint number of CCI points is correct'
    );

    chart.series[0].setData([
        [0, 24, 70, 24, 84, 24, 44, 24, 58],
        [1, 24, 65, 24, 75, 24, 20, 24, 53],
        [2, 24, 48, 24, 51, 24, 25, 24, 35],
        [3, 24, 46, 24, 68, 24, 21, 24, 34],
        [4, 24, 62, 24, 67, 24, 15, 24, 23],
        [5, 23, 81, 23, 84, 23, 63, 23, 76],
        [6, 23, 91, 24, 30, 23, 76, 24, 20]
    ], false);

    chart.series[1].update({
        color: 'red',
        params: {
            period: 4
        }
    });

    assert.deepEqual(
        chart.series[1].yData,
        [-41.97530864197531, 40.47619047619052, 125.00000000000001, -45.83333333333332],
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
        [-27.45098039215686, 119.12568306010934, -45.83333333333332],
        'Correct values after point.remove()'
    );
});
