QUnit.test('Dependency wheel', function (assert) {
    const chart = Highcharts.chart('container', {
        series: [
            {
                keys: ['from', 'to', 'weight', 'weightTo'],
                data: [
                    ['Brazil', 'Portugal', 5, 2],
                    ['Brazil', 'France', 1],
                    ['Portugal', 'Canada', 1, 3],
                    ['Canada', 'France', 5],
                    ['USA', 'Portugal', 1, 3],
                    ['USA', 'France', 2],
                    ['USA', 'Brazil', 5, 3]
                ],
                type: 'dependencywheel'
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].points.length,
        7,
        'Series successfully added'
    );
    assert.strictEqual(
        chart.series[0].nodes.length,
        5,
        'Series successfully added'
    );
    assert.deepEqual(
        chart.series[0].nodes.map(node => node.sum),
        [9, 6, 8, 8, 8],
        'Node sum correct'
    );

    chart.series[0].addPoint({
        id: 'pointTest',
        from: 'Canada',
        to: 'Portugal',
        weight: 1,
        weightTo: 3
    });
    assert.strictEqual(chart.series[0].points.length, 8, 'addPoint');
    assert.strictEqual(chart.series[0].nodes.length, 5, 'addPoint');

    assert.deepEqual(
        chart.series[0].nodes.map(node => node.sum),
        [9, 9, 8, 9, 8],
        'Node sum correct after addPoint'
    );

    chart.get('pointTest').update({
        weight: 3,
        weightTo: 7
    });
    assert.deepEqual(
        chart.series[0].nodes.map(node => node.sum),
        [9, 13, 8, 11, 8],
        'Node sum correct after point update'
    );

    chart.series[0].removePoint(0);
    assert.strictEqual(
        chart.series[0].points.length,
        7,
        'points length correct after removePoint'
    );
    assert.strictEqual(
        chart.series[0].nodes.length,
        5,
        'nodes length correct after removePoint'
    );
    assert.deepEqual(
        chart.series[0].nodes.map(node => node.sum),
        [4, 11, 8, 11, 8],
        'Node sum correct after point remove'
    );
});
