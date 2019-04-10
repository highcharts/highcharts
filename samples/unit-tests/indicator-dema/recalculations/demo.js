QUnit.test('Test algorithm on data updates.', function (assert) {

    var chart = Highcharts.stockChart('container', {
        series: [{
            id: 'main',
            data: [
                22.27, 22.19, 22.08, 22.17, 22.18, 22.13, 22.23,
                22.43, 22.24, 22.29, 22.15, 22.39
            ]
        }, {
            type: 'dema',
            linkedTo: 'main',
            params: {
                period: 3
            }
        }]
    });

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + 2 * chart.series[1].options.params.period - 2,
        'Initial number of DEMA points is correct'
    );

    assert.deepEqual(
        chart.series[1].yData,
        [22.1775, 22.141875, 22.205, 22.37703125, 22.29078125, 22.2940234375, 22.188828125, 22.332822265625],
        'Correct values'
    );

    chart.series[0].setData([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22.15, 22.39, 22.38]);

    assert.deepEqual(
        chart.series[1].yData,
        [0, 0, 0, 0, 0, 0, 16.6125, 22.33, 23.766875],
        'Correct values'
    );

    chart.series[0].addPoint(22.38);

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + 2 * chart.series[1].options.params.period - 2,
        'After addPoint number of DEMA points is correct'
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
        [23.75, 23.824444444444, 23.941851851851, 23.674074074074, 23.793621399177],
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
        [23.83, 23.945925925926, 23.676172839507, 23.794567901234],
        'Correct values after point.remove()'
    );
});
