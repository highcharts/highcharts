QUnit.test('Test algorithm on data updates.', function (assert) {

    var correctFloat = Highcharts.correctFloat,
        chart = Highcharts.stockChart('container', {
            series: [{
                id: 'main',
                data: [1, 1.5, 2.8, 3.5, 3.9, 4.2]
            }, {
                type: 'trendline',
                linkedTo: 'main'
            }]
        }),
        tr = chart.series[1].yData;

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length,
        'Initial number of Trendline points is correct'
    );

    assert.deepEqual(
        correctFloat(tr[0], 2) === 1.1 &&
        correctFloat(tr[tr.length - 1], 2) === 4.5,
        true,
        'Correct values'
    );

    chart.series[0].points[3].remove();

    assert.deepEqual(
        correctFloat(tr[0], 2) === 1.1 &&
        correctFloat(tr[tr.length - 1], 2) === 4.5,
        true,
        'Correct values after point.remove()'
    );

    chart.series[0].addPoint(22.38);

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length,
        'After addPoint number of Trendline points is correct'
    );

    chart.series[1].update({
        color: 'red'
    });

    assert.strictEqual(
        chart.series[1].graph.attr('stroke'),
        'red',
        'Line color changed'
    );
});
