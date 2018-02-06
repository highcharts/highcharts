
QUnit.test('Test algorithm on data updates.', function (assert) {

    var chart = Highcharts.stockChart('container', {
        series: [{
            id: 'main',
            data: [
                22.27, 22.19, 22.08, 22.17, 22.18, 22.13, 22.23,
                22.43, 22.24, 22.29, 22.15, 22.39
            ]
        }, {
            type: 'ema',
            linkedTo: 'main',
            params: {
                period: 10
            }
        }]
    });

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.period - 1,
        'Initial number of EMA points is correct'
    );

    assert.deepEqual(
        chart.series[1].yData,
        [22.220999999999997, 22.208090909090906, 22.241165289256195],
        'Correct values'
    );

    chart.series[0].setData([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22.15, 22.39, 22.38]);

    assert.deepEqual(
        chart.series[1].yData,
        [0, 4.027272727272727, 7.365950413223141, 10.095777610818933],
        'Correct values'
    );

    chart.series[0].addPoint(22.38);

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.period - 1,
        'After addPoint number of EMA points is correct'
    );

    chart.series[0].setData([23.36, 24.05, 23.75, 23.83, 23.95, 23.63, 23.82], false);
    chart.series[1].update({
        color: 'red',
        params: {
            period: 3
        }
    });

    assert.deepEqual(
        chart.series[1].yData,
        [23.72, 23.775, 23.862499999999997, 23.746249999999996, 23.783125],
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
        [23.746666666666666, 23.848333333333333, 23.739166666666666, 23.779583333333335],
        'Correct values after point.remove()'
    );
});
