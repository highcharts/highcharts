
QUnit.test('Test algorithm on data updates.', function (assert) {

    var chart = Highcharts.stockChart('container', {
        series: [{
            id: 'main',
            type: 'ohlc',
            data: [
                [62.1, 62.34, 61.37, 62.15],
                [62.1, 62.05, 60.69, 60.81],
                [62.1, 62.27, 60.10, 60.45],
                [62.1, 60.79, 58.61, 59.18],
                [62.1, 59.93, 58.71, 59.24]
            ]
        }, {
            name: 'Volume',
            id: 'volume',
            data: [7849, 11692, 10575, 13059, 20734]
        }, {
            type: 'ad',
            linkedTo: 'main',
            params: {
                period: 0,
                volumeSeriesID: 'volume'
            }
        }]
    });

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[2].points.length + chart.series[2].options.params.period,
        'Initial number of AD points is correct'
    );

    assert.deepEqual(
        chart.series[2].yData,
        [4774.134020618497, -4854.5718617343655, -12018.28153915371, -18248.26319052985, -20967.476305283893],
        'Correct values'
    );

    chart.series[0].addPoint([62.1, 61.75, 59.86, 60.20], false);
    chart.series[1].addPoint(29630);

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[2].points.length + chart.series[2].options.params.period,
        'After addPoint number of AD points is correct'
    );

    chart.series[0].setData([
                [62.1, 60.00, 57.97, 58.48],
                [62.1, 59.00, 58.02, 58.24],
                [62.1, 59.07, 57.48, 58.69],
                [62.1, 59.22, 58.30, 58.65],
                [62.1, 58.75, 57.83, 58.47]
    ], false);

    chart.series[1].setData([17705, 7259, 10475, 5204, 3423], false);
    chart.series[2].update({
        color: 'red',
        params: {
            period: 3
        }
    });

    assert.deepEqual(
        chart.series[2].yData,
        [-1244.4347826086869, 95.00000000000409],
        'Correct values'
    );

    assert.strictEqual(
        chart.series[2].graph.attr('stroke'),
        'red',
        'Line color changed'
    );

    chart.series[0].points[2].remove();
    chart.series[1].points[2].remove();

    assert.deepEqual(
        chart.series[2].yData,
        [2036.3478260869495],
        'Correct values after point.remove()'
    );
});
