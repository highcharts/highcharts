QUnit.test('Test algorithm on data updates.', function (assert) {

    var chart = Highcharts.stockChart('container', {
        series: [{
            id: 'main',
            data: [
                22.27, 22.19, 22.08, 22.17, 22.18, 22.13, 22.23,
                22.43, 22.24, 22.29, 22.15, 22.39
            ]
        }, {
            type: 'tema',
            linkedTo: 'main',
            params: {
                period: 3
            }
        }]
    });

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + 3 * chart.series[1].options.params.period - 3,
        'Initial number of TEMA points is correct'
    );

    assert.deepEqual(
        chart.series[1].yData.map(function (y) {
            return y.toFixed(4);
        }),
        ["22.2133", "22.4077", "22.2807", "22.2870", "22.1659", "22.3499"],
        'Correct values'
    );

    chart.series[0].setData([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22.15, 22.39, 22.38]);

    assert.deepEqual(
        chart.series[1].yData,
        [0, 0, 0, 0, 19.38125, 23.744375, 23.780625],
        'Correct values'
    );

    chart.series[0].addPoint(22.38);

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + 3 * chart.series[1].options.params.period - 3,
        'After addPoint number of TEMA points is correct'
    );

    chart.series[0].setData([23.36, 24.05, 23.75, 23.83, 23.95, 23.63, 23.82], false);
    chart.series[1].update({
        color: 'red',
        params: {
            period: 2
        }
    });

    assert.deepEqual(
        chart.series[1].yData,
        [23.824444444444, 23.947283950616, 23.646502057613, 23.802016460905],
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
        [23.945925925926, 23.645390946503, 23.801262002742],
        'Correct values after point.remove()'
    );
});
