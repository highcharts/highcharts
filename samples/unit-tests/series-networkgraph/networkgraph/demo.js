QUnit.test('Network Graph', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'networkgraph'
        }
    });

    assert.notStrictEqual(
        chart.container.querySelector('.highcharts-no-data'),
        null,
        'No-data label should display when there is no data (#9801)'
    );

    chart.addSeries({
        layoutAlgorithm: {
            enableSimulation: false
        },
        keys: ['from', 'to'],
        data: [
            ['A', 'B'],
            ['A', 'C'],
            ['A', 'D'],

            ['B', 'A'],
            ['B', 'C'],

            ['C', 'D'],

            ['D', 'A']
        ]
    });

    assert.strictEqual(
        chart.series[0].points.length,
        7,
        'Series successfully added'
    );

    assert.strictEqual(
        chart.container.querySelector('.highcharts-no-data'),
        null,
        'No-data label should NOT display when there is data (#9801)'
    );

    chart.addSeries({
        keys: ['from', 'to'],
        data: [
            ['1', '2'],
            ['2', '1'],
            ['3', '1']
        ]
    });

    assert.ok(true, 'No errors in cyclical graphs (#9803)');
});
