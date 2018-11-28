
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
        name: 'Energy in the United States',
        states: {
            hover: {
                color: '#FF0000'
            }
        }
    });

    assert.strictEqual(
        chart.container.querySelector('.highcharts-no-data'),
        null,
        'No-data label should not display when there is data (#7489)'
    );

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

    series.data[0].setState('hover');

    assert.strictEqual(
        Highcharts.color(series.data[0].graphic.element.getAttribute('fill')).get('rgb'),
        'rgb(255,0,0)',
        'Hover color correct'
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

    series.update({
        keys: ['from', 'to', 'weight'],
        data: [
            ['A', '1', 1]
        ]
    });

    assert.strictEqual(
        series.nodes.length,
        2,
        'Unused nodes should be removed'
    );

    series.remove();
    assert.strictEqual(
        chart.series.length,
        0,
        'Series removed'
    );

    assert.strictEqual(
        typeof chart.container.querySelector('.highcharts-no-data'),
        'object',
        'No-data label should display when there is no data (#7489)'
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

QUnit.test('Sankey column option', function (assert) {
    var chart = Highcharts.chart('container', {

        chart: {
            plotBorderWidth: 1
        },

        title: {
            text: 'Highcharts Sankey diagram'
        },

        subtitle: {
            text: 'Node column and offset options'
        },

        series: [{
            keys: ['from', 'to', 'weight'],
            data: [
                ['1', '3', 1775 ],
                ['1', '4', 2877 ],
                ['10', '11', 216 ],
                ['10', '12', 32 ],
                ['11', '13', 5 ],
                ['11', '14', 5 ],
                ['11', '17', 833 ],
                ['11', '18', 142 ],
                ['12', '13', 6 ],
                ['12', '14', 3 ],
                ['12', '17', 82 ],
                ['12', '18', 40 ],
                ['13', '15', 7 ],
                ['13', '16', 4 ],
                ['14', '15', 7 ],
                ['14', '16', 1 ],
                ['15', '17', 20 ],
                ['15', '18', 6 ],
                ['16', '17', 7 ],
                ['16', '18', 2 ],
                ['18', '19', 1153 ],
                ['18', '20', 5037 ],
                ['2', '3', 21863 ],
                ['2', '4', 5931 ],
                ['3', '17', 20207 ],
                ['3', '18', 1456 ],
                ['3', '5', 782 ],
                ['3', '6', 1193 ],
                ['4', '17', 3934 ],
                ['4', '18', 3006 ],
                ['4', '5', 1102 ],
                ['4', '6', 766 ],
                ['5', '7', 1396 ],
                ['5', '8', 488 ],
                ['6', '7', 1415 ],
                ['6', '8', 544 ],
                ['7', '10', 163 ],
                ['7', '17', 2860 ],
                ['7', '18', 838 ],
                ['7', '9', 94 ],
                ['8', '10', 85 ],
                ['8', '17', 752 ],
                ['8', '18', 448 ],
                ['8', '9', 170 ],
                ['9', '11', 227 ],
                ['9', '12', 37 ]

            ],
            nodes: [{
                id: '1',
                column: 1
            }, {
                id: '2',
                column: 1
            }, {
                id: '3',
                column: 2
            }, {
                id: '4',
                column: 2
            }, {
                id: '5',
                column: 3
            }, {
                id: '6',
                column: 3
            }, {
                id: '7',
                column: 4
            }, {
                id: '8',
                column: 4
            }, {
                id: '9',
                column: 5
            }, {
                id: '10',
                column: 5
            }, {
                id: '11',
                column: 6
            }, {
                id: '12',
                column: 6
            }, {
                id: '13',
                column: 7
            }, {
                id: '14',
                column: 7
            }, {
                id: '15',
                column: 8
            }, {
                id: '16',
                column: 8
            }, {
                id: '17',
                column: 9
            }, {
                id: '18',
                column: 9
            }, {
                id: '19',
                column: 10
            }, {
                id: '20',
                column: 10
            }],
            type: 'sankey',
            name: 'Flow'
        }]

    });

    assert.deepEqual(
        chart.series[0].nodeColumns.map(function (col) {
            return col.length;
        }),
        [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        'First column should be empty (#8865)'
    );
});

