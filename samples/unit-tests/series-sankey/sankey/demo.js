
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

QUnit.test('Sankey nodeFormat, nodeFormatter', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 600
        },
        series: [{
            keys: ['from', 'to', 'weight'],
            data: [
                ['A', '1', 9],
                ['B', '1', 3],
                ['A', '2', 5],
                ['B', '2', 5]
            ],
            type: 'sankey'
        }]
    });

    var series = chart.series[0];

    // Defaults
    assert.strictEqual(
        series.nodes[0].dataLabel.text.textStr,
        'A',
        'Default nodeFormatter'
    );
    assert.strictEqual(
        series.points[0].dataLabel.text.textStr,
        '',
        'Default point formatter'
    );
    series.nodes[0].onMouseOver();
    assert.notEqual(
        chart.tooltip.label.text.textStr.indexOf('A:'),
        -1,
        'Tooltip ok'
    );

    series.update({
        dataLabels: {
            nodeFormatter: function () {
                return 'Foo';
            },
            formatter: function () {
                return 'Bar';
            }
        },
        tooltip: {
            nodeFormatter: function () {
                return 'Foo';
            }
        }
    });

    // Formatters
    assert.strictEqual(
        series.nodes[0].dataLabel.text.textStr,
        'Foo',
        'Explicit nodeFormatter'
    );
    assert.strictEqual(
        series.points[0].dataLabel.text.textStr,
        'Bar',
        'Explicit point formatter'
    );
    series.nodes[0].onMouseOver();
    assert.notEqual(
        chart.tooltip.label.text.textStr.indexOf('Foo'),
        -1,
        'Tooltip ok'
    );



    series.update({
        dataLabels: {
            nodeFormat: 'Nodez',
            format: 'Linkz'
        },
        tooltip: {
            nodeFormat: 'Nodez',
            nodeFormatter: null
        }
    });

    // Formats take precedence
    assert.strictEqual(
        series.nodes[0].dataLabel.text.textStr,
        'Nodez',
        'Explicit nodeFormat'
    );
    assert.strictEqual(
        series.points[0].dataLabel.text.textStr,
        'Linkz',
        'Explicit point format'
    );
    series.nodes[0].onMouseOver();
    assert.notEqual(
        chart.tooltip.label.text.textStr.indexOf('Nodez'),
        -1,
        'Tooltip ok'
    );

});

