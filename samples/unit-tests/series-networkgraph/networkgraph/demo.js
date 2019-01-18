QUnit.test('Network Graph', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'networkgraph'
        }
    });
    var point;

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
        ],
        nodes: [
            {
                id: 'D',
                color: '#FF0000'
            }
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
        keys: ['from', 'to', 'width', 'color', 'dashStyle'],
        data: [
            ['1', '2'],
            ['2', '1', '2', '#FF0000', 'dot'],
            ['3', '1']
        ]
    });

    assert.ok(true, 'No errors in cyclical graphs (#9803)');

    assert.strictEqual(
        chart.series[0].nodes[3].graphic.element.getAttribute('fill'),
        '#FF0000',
        'Custom series.nodes.color is correct'
    );

    point = chart.series[1].points[1];

    assert.strictEqual(
        point.graphic.element.getAttribute('stroke'),
        '#FF0000',
        'Custom series.data.color is correct (#9798)'
    );

    assert.strictEqual(
        point.graphic.element.getAttribute('stroke-width'),
        '2',
        'Custom series.data.width is correct (#9798)'
    );

    assert.strictEqual(
        point.graphic.element.getAttribute('stroke-dasharray'),
        '2,6',
        'Custom series.data.dashStyle is correct (#9798)'
    );
});
