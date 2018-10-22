
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
                type: 'sma',
                linkedTo: 'main'
            }]
        }),
        secondSeries;

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.period - 1,
        'Initial number of SMA points is correct'
    );

    chart.series[0].addPoint(13);

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.period - 1,
        'After addPoint number of SMA points is correct'
    );

    chart.series[0].setData([11, 12, 13, 14, 15, 16, 17], false);
    chart.series[1].update({
        color: 'red',
        params: {
            period: 5
        }
    });

    assert.deepEqual(
        chart.series[1].yData,
        [13, 14, 15],
        'Correct values'
    );

    assert.strictEqual(
        chart.series[1].graph.attr('stroke'),
        'red',
        'Line color changed'
    );

    chart.series[0].points[6].remove();

    assert.deepEqual(
        chart.series[1].yData,
        [13, 14],
        'Correct values after point.remove()'
    );

    chart.series[0].addPoint([6, 13], true, true);

    assert.strictEqual(
        chart.series[1].points[chart.series[1].points.length - 1].x,
        chart.series[0].points[chart.series[0].points.length - 1].x,
        'Correct last point position after addPoint() with shift parameter (#8572)'
    );

    secondSeries = chart.addSeries({
        id: 'second',
        showInNavigator: true,
        cropThreshold: 2,
        pointStart: 1,
        data: [
            13, 14, 15, 13, 14, 15,
            13, 14, 15, 13, 14, 15,
            13, 14, 15, 13, 14, 15,
            13, 14, 15, 13, 14, 15,
            13, 14, 15, 13, 14, 15
        ]
    });

    chart.addSeries({
        type: 'sma',
        linkedTo: 'second'
    });

    chart.xAxis[0].setExtremes(25, 30);

    secondSeries.points[secondSeries.points.length - 1].update(100);

    assert.ok(
        'No errors after updating point in a cropped dataset (#8968)'
    );
});
