
QUnit.test('Test algorithm on data updates.', function (assert) {

    var chart = Highcharts.stockChart('container', {
        series: [{
            id: 'main',
            data: [
                13, 14, 15, 13, 14, 15,
                13, 14, 15, 13, 14, 15,
                13, 14, 15, 13, 14, 15,
                13, 14, 15, 13, 14, 15,
                13, 14, 15, 13, 14, 15
            ]
        }, {
            type: 'wma',
            linkedTo: 'main'
        }]
    });

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.period - 1,
        'Initial number of WMA points is correct'
    );

    chart.series[0].addPoint(16);

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.period - 1,
        'After addPoint number of WMA points is correct'
    );

    chart.series[0].setData([0, 77, 79, 79, 81, 83], false);
    chart.series[1].update({
        color: 'red',
        params: {
            period: 5
        }
    });

    assert.deepEqual(
        Highcharts.correctFloat(chart.series[1].yData[1]),
        Highcharts.correctFloat(83 * (5 / 15) + 81 * (4 / 15) + 79 * (3 / 15) + 79 * (2 / 15) + 77 * (1 / 15)),
        'Correct values'
    );

    assert.strictEqual(
        chart.series[1].graph.attr('stroke'),
        'red',
        'Line color changed'
    );

    chart.series[0].points[5].remove();

    assert.deepEqual(
        Highcharts.correctFloat(chart.series[1].yData[0]),
        Highcharts.correctFloat(81 * (5 / 15) + 79 * (4 / 15) + 79 * (3 / 15) + 77 * (2 / 15) + 0),
        'Correct values after point.remove()'
    );
});
