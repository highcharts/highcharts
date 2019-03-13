QUnit.test('Test algorithm on data updates.', function (assert) {

    var chart = Highcharts.stockChart('container', {
        series: [{
            id: 'main',
            data: [
                22.27, 22.19, 22.08, 22.17, 22.18, 22.13, 22.23,
                22.43, 22.24, 22.29, 22.15, 22.39
            ]
        }, {
            type: 'trix',
            linkedTo: 'main',
            params: {
                period: 3
            }
        }]
    });

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + 3 * chart.series[1].options.params.period - 2,
        'Initial number of TRIX points is correct'
    );

    assert.deepEqual(
        chart.series[1].yData.map(function (y) {
            return y.toFixed(4);
        }),
        ["0.1598", "0.1143", "0.0825", "-0.0207", "0.0563"],
        'Correct values'
    );

    chart.series[0].setData([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22.15, 22.39, 22.38]);

    assert.deepEqual(
        chart.series[1].yData,
        [null, null, null, null, 151.08352144469528, 60.37040366807517],
        'Correct values'
    );

    chart.series[0].addPoint(22.38);

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + 3 * chart.series[1].options.params.period - 2,
        'After addPoint number of TRIX points is correct'
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
        [0.3114220132213561, -0.15254976655111894, -0.011592808651669301],
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
        [-0.09874544858885302, 0.013790711812039323],
        'Correct values after point.remove()'
    );
});
