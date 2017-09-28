QUnit.test('Bullet', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'bullet'
        },
        series: [{
            data: [
                [5, 10],
                [10, 10],
                [15, 5],
                [null, 40],
                [7, null],
                [null, null],
                [0, 0]
            ]
        }]
    });

    assert.deepEqual(
        chart.series[0].points.length,
        7,
        'Series successfully added'
    );

    chart.series[0].addPoint({
        y: 20,
        target: 10
    });

    assert.deepEqual(
        chart.series[0].points.length,
        8,
        'addPoint'
    );

    chart.series[0].removePoint(0);
    assert.deepEqual(
        chart.series[0].points.length,
        7,
        'removePoint'
    );
});
