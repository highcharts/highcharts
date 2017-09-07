
QUnit.test('Test algorithm on data updates.', function (assert) {

    var chart = Highcharts.stockChart('container', {
        series: [{
            id: 'main',
            type: 'candlestick',
            data: [
                [0, 10, 11, 9, 10],
                [1, 10, 20, 10, 15],
                [2, 15, 25, 10, 20],
                [3, 20, 21, 1, 5],
                [4, 5, 21, 5, 10],
                [5, 10, 11, 1, 10]
            ]
        }, {
            type: 'zigzag',
            linkedTo: 'main'
        }]
    });

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length,
        'Initial number of Zig Zag points is correct'
    );

    chart.series[0].addPoint([6, 10, 30, 10, 10]);

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length,
        'After addPoint number of Zig Zag points is correct'
    );

    chart.series[1].update({
        color: 'red',
        params: {
            deviation: 5
        }
    });

    assert.strictEqual(
        chart.series[1].graph.attr('stroke'),
        'red',
        'Line color changed'
    );

    chart.series[0].points[6].remove();

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length,
        'Initial number of Zig Zag points is correct'
    );
});
