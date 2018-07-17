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


    chart.series[0].setData([27, 38, 22, 11, 2]);
    var pos = [
        chart.series[0].data[4].dataLabel.x,
        chart.series[0].data[4].dataLabel.y
    ];
    assert.ok(
        !isNaN(pos[0]) && !isNaN(pos[1]),
        'dataLabel drawn correctly'
    );

});
