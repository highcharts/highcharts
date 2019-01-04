QUnit.test('Network Graph', function (assert) {
    var chart = Highcharts.chart('container', {});

    chart.addSeries({
        layoutAlgorithm: {
            enableSimulation: false
        },
        keys: ['from', 'to'],
        data: [
            ['A', 'B'],
            ['B', 'A'],
            ['C', 'A']
        ],
        type: 'networkgraph'
    });

    assert.strictEqual(
        chart.series[0].points.length,
        3,
        'Series successfully added'
    );

});
