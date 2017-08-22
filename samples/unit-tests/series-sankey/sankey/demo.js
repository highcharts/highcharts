
QUnit.test('Sankey', function (assert) {
    var chart = Highcharts.chart('container', {});



    var series = chart.addSeries({
        keys: ['from', 'to', 'weight'],
        data: [
            ['A', '1', 9],
            ['B', '1', 3],
            ['A', '2', 5],
            ['B', '2', 5]
        ],
        nodes: [{
            id: 'Oil',
            color: '#666666'
        }, {
            id: 'Natural Gas',
            color: '#7cb5ec'
        }, {
            id: 'Coal',
            color: '#000000'
        }, {
            id: 'Renewable',
            color: '#90ed7d'
        }, {
            id: 'Nuclear',
            color: '#f7a35c'
        }],
        type: 'sankey',
        name: 'Energy in the United States'
    });

    assert.strictEqual(
        chart.series[0].points.length,
        4,
        'Series successfully added'
    );
    assert.strictEqual(
        chart.series[0].nodes.length,
        4,
        'Series successfully added'
    );

    series.addPoint({
        id: 'C-2',
        from: 'C',
        to: '2',
        weight: 5
    });
    assert.strictEqual(
        chart.series[0].points.length,
        5,
        'addPoint'
    );
    assert.strictEqual(
        chart.series[0].nodes.length,
        5,
        'addPoint'
    );

    chart.get('C-2').update({
        to: '3'
    });
    assert.strictEqual(
        series.points.length,
        5,
        'addPoint'
    );
    assert.strictEqual(
        series.nodes.length,
        6,
        'Point update'
    );

    series.removePoint(0);
    assert.strictEqual(
        series.points.length,
        4,
        'addPoint'
    );
    assert.strictEqual(
        series.nodes.length,
        6,
        'Point update'
    );

    series.remove();
    assert.strictEqual(
        chart.series.length,
        0,
        'Series removed'
    );

});
