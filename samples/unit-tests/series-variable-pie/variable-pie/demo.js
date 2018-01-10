QUnit.test('variable-pie', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'variablepie'
        },
        series: [{
            minPointSize: '20%',
            data: [
                [5, 10],
                [10, 10],
                [15, 5],
                [20, 40],
                [7, null],
                [20, 20],
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
        z: 50
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
