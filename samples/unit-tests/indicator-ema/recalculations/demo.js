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
        [22.220999999999997, 22.208090909091, 22.241165289256],
        'Correct values'
    );

    chart.series[0].setData([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22.15, 22.39, 22.38]);

    assert.deepEqual(
        chart.series[1].yData,
        [0, 4.0272727272727, 7.3659504132231, 10.095777610819],
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
        [23.72, 23.775, 23.8625, 23.74625, 23.783125],
        'Correct values'
    );

    assert.strictEqual(
        chart.series[1].graph.attr('stroke'),
        'red',
        'Line color changed'
    );

    chart.series[0].points[2].remove();

    assert.deepEqual(
        chart.series[1].yData.map(function (y) {
            return y.toFixed(4);
        }),
        ["23.7467", "23.8483", "23.7392", "23.7796"],
        'Correct values after point.remove()'
    );
});
