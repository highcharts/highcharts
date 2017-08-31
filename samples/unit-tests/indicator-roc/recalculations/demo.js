
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
            type: 'roc',
            linkedTo: 'main'
        }]
    });

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length +
            chart.series[1].options.params.period,
        'Initial number of ROC points is correct'
    );

    chart.series[0].addPoint(16);

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length +
            chart.series[1].options.params.period,
        'After addPoint number of ROC points is correct'
    );

    chart.series[0].setData([80, 81, 0, 77, 79, 79, 81, 83, 80], false);
    chart.series[1].update({
        color: 'red',
        params: {
            period: 5
        }
    });

    assert.strictEqual(
        Highcharts.correctFloat(chart.series[1].yData[3]),
        Highcharts.correctFloat((80 - 77) / 77 * 100),
        'Correct values'
    );

    assert.strictEqual(
        chart.series[1].yData.length,
        4,
        'Correct number of points'
    );

    assert.strictEqual(
        chart.series[1].graph.attr('stroke'),
        'red',
        'Line color changed'
    );

    chart.series[0].points[5].remove();

    assert.strictEqual(
        chart.series[1].yData[2],
        null,
        'Correct values after point.remove()'
    );
});
