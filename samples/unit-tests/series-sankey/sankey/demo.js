QUnit.test('Sankey', function (assert) {
    const chart = Highcharts.chart('container', {});
    let series = chart.addSeries(
        {
            keys: ['from', 'to', 'weight'],
            data: [
                ['A', '1', 9],
                ['B', '1', 3],
                ['A', '2', 5],
                ['B', '2', 5]
            ],
            nodes: [
                {
                    id: 'Oil',
                    color: '#666666'
                },
                {
                    id: 'Natural Gas',
                    color: '#7cb5ec'
                },
                {
                    id: 'Coal',
                    color: '#000000'
                },
                {
                    id: 'Renewable',
                    color: '#90ed7d'
                },
                {
                    id: 'Nuclear',
                    color: '#f7a35c'
                }
            ],
            type: 'sankey',
            name: 'Energy in the United States',
            states: {
                hover: {
                    color: '#FF0000'
                }
            }
        },
        false
    );

    // This would cause an error prior to #9300
    series.update(
        {
            events: {}
        },
        false
    );
    chart.redraw();

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
        Highcharts.color(
            series.data[0].graphic.element.getAttribute('fill')
        ).get('rgb'),
        'rgb(255,0,0)',
        'Hover color correct'
    );

    series.addPoint({
        id: 'C-2',
        from: 'C',
        to: '2',
        weight: 5
    });
    assert.strictEqual(chart.series[0].points.length, 5, 'addPoint');
    assert.strictEqual(chart.series[0].nodes.length, 5, 'addPoint');

    chart.get('C-2').update({
        to: '3'
    });
    assert.strictEqual(series.points.length, 5, 'addPoint');
    assert.strictEqual(series.nodes.length, 6, 'Point update');

    series.removePoint(0);
    assert.strictEqual(series.points.length, 4, 'addPoint');
    assert.strictEqual(series.nodes.length, 6, 'Point update');

    series.update({
        keys: ['from', 'to', 'weight'],
        data: [['A', '1', 1]]
    });

    assert.strictEqual(
        series.nodes.length,
        2,
        'Unused nodes should be removed'
    );

    series.remove();
    assert.strictEqual(chart.series.length, 0, 'Series removed');

    assert.strictEqual(
        typeof chart.container.querySelector('.highcharts-no-data'),
        'object',
        'No-data label should display when there is no data (#7489)'
    );

    series = chart.addSeries({
        type: 'sankey',
        keys: ['from', 'to', 'weight'],
        data: [
            ['A', 'B', 500],
            ['B', 'C', 1]
        ]
    });

    const { toNode } = series.points[1];

    assert.ok(
        toNode.graphic.r < toNode.graphic.height,
        `Border radius should not greater than half the height of the node,
        small nodes shouldn't be rendered as circles (#18956).`
    );

    const lastNode = series.nodeColumns[2][0];

    assert.close(
        lastNode.nodeY,
        (chart.plotHeight - lastNode.graphic.height) / 2,
        2,
        'Center-aligned nodes should be in the correct y-position. (#19096)'
    );

    series.update({
        nodeAlignment: 'top'
    });

    assert.strictEqual(
        lastNode.nodeY,
        0,
        'Top-aligned nodes should be in the correct y-position. (#19096)'
    );

    series.update({
        nodeAlignment: 'bottom'
    });

    assert.strictEqual(
        lastNode.nodeY,
        chart.plotHeight - lastNode.graphic.height,
        'Bottom-aligned nodes should be in the correct y-position. (#19096)'
    );
});

QUnit.test('Sankey nodeFormat, nodeFormatter', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 600
        },
        series: [
            {
                keys: ['from', 'to', 'weight'],
                data: [
                    ['A', '1', 9],
                    ['B', '1', 3],
                    ['A', '2', 5],
                    ['B', '2', 5]
                ],
                type: 'sankey'
            }
        ]
    });

    var series = chart.series[0];

    // Defaults
    assert.strictEqual(
        series.nodes[0].dataLabel.text.textStr,
        'A',
        'Default nodeFormatter'
    );
    assert.strictEqual(
        series.points[0].dataLabel,
        undefined,
        'Default point (link) formatter should not produce a label'
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

    series.nodes[0].update({
        color: 'red'
    });

    // After update, nodes should still use nodeFormat etc
    assert.strictEqual(
        series.nodes[0].dataLabel.text.textStr,
        'Nodez',
        'Explicit nodeFormat'
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

        series: [
            {
                keys: ['from', 'to', 'weight'],
                data: [
                    ['1', '3', 1775],
                    ['1', '4', 2877],
                    ['10', '11', 216],
                    ['10', '12', 32],
                    ['11', '13', 5],
                    ['11', '14', 5],
                    ['11', '17', 833],
                    ['11', '18', 142],
                    ['12', '13', 6],
                    ['12', '14', 3],
                    ['12', '17', 82],
                    ['12', '18', 40],
                    ['13', '15', 7],
                    ['13', '16', 4],
                    ['14', '15', 7],
                    ['14', '16', 1],
                    ['15', '17', 20],
                    ['15', '18', 6],
                    ['16', '17', 7],
                    ['16', '18', 2],
                    ['18', '19', 1153],
                    ['18', '20', 5037],
                    ['2', '3', 21863],
                    ['2', '4', 5931],
                    ['3', '17', 20207],
                    ['3', '18', 1456],
                    ['3', '5', 782],
                    ['3', '6', 1193],
                    ['4', '17', 3934],
                    ['4', '18', 3006],
                    ['4', '5', 1102],
                    ['4', '6', 766],
                    ['5', '7', 1396],
                    ['5', '8', 488],
                    ['6', '7', 1415],
                    ['6', '8', 544],
                    ['7', '10', 163],
                    ['7', '17', 2860],
                    ['7', '18', 838],
                    ['7', '9', 94],
                    ['8', '10', 85],
                    ['8', '17', 752],
                    ['8', '18', 448],
                    ['8', '9', 170],
                    ['9', '11', 227],
                    ['9', '12', 37]
                ],
                nodes: [
                    {
                        id: '1',
                        column: 1
                    },
                    {
                        id: '2',
                        column: 1
                    },
                    {
                        id: '3',
                        column: 2
                    },
                    {
                        id: '4',
                        column: 2
                    },
                    {
                        id: '5',
                        column: 3
                    },
                    {
                        id: '6',
                        column: 3
                    },
                    {
                        id: '7',
                        column: 4
                    },
                    {
                        id: '8',
                        column: 4
                    },
                    {
                        id: '9',
                        column: 5
                    },
                    {
                        id: '10',
                        column: 5
                    },
                    {
                        id: '11',
                        column: 6
                    },
                    {
                        id: '12',
                        column: 6
                    },
                    {
                        id: '13',
                        column: 7
                    },
                    {
                        id: '14',
                        column: 7
                    },
                    {
                        id: '15',
                        column: 8
                    },
                    {
                        id: '16',
                        column: 8
                    },
                    {
                        id: '17',
                        column: 9
                    },
                    {
                        id: '18',
                        column: 9
                    },
                    {
                        id: '19',
                        column: 10
                    },
                    {
                        id: '20',
                        column: 10
                    }
                ],
                type: 'sankey',
                name: 'Flow'
            }
        ]
    });

    assert.deepEqual(
        chart.series[0].nodeColumns.map(function (col) {
            return col.length;
        }),
        [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        'First column should be empty (#8865)'
    );
});

QUnit.test('Sankey and unordered data', assert => {
    const chart = Highcharts.chart('container', {
        title: {
            text: 'Unordered Sankey'
        },

        series: [
            {
                keys: ['from', 'to', 'weight'],
                data: [
                    [1, 573, 1],
                    [573, 574, 1],
                    [573, 577, 1],
                    [574, 586, 1],
                    [575, 585, 1],
                    [575, 596, 1],
                    [577, 575, 1],
                    [578, 582, 1],
                    [582, 609, 1],
                    [582, 606, 1],
                    [584, 578, 1],
                    [596, 584, 1],
                    [606, 607, 1],
                    [607, 608, 1]
                ],
                type: 'sankey',
                name: 'Sankey demo series'
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].nodeColumns[0].length,
        1,
        'There should be only one item in the first (root) column'
    );

    chart.series[0].setData([
        [480, 481, 1],
        [481, 482, 1],
        [472, 477, 1],
        [481, 474, 1],
        [1, 472, 1],
        [472, 473, 1],
        [474, 475, 1],
        [475, 476, 1],
        [477, 478, 1],
        [478, 479, 1],
        [479, 480, 1]
    ]);

    assert.strictEqual(
        chart.series[0].nodeColumns[0].length,
        1,
        'There should be only one item in the first (root) column'
    );

    chart.series[0].setData([
        ['a', 'b', 5],
        ['b', 'c', 5],
        ['c', 'b', 5]
    ]);

    assert.strictEqual(
        chart.series[0].nodes.length,
        3,
        'Circular data should not cause endless recursion'
    );
});

QUnit.test('Sankey and inactive state', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [
                {
                    keys: ['from', 'to', 'weight'],
                    data: [
                        ['Brazil', 'Portugal', 5],
                        ['Portugal', 'England', 15]
                    ],
                    type: 'sankey'
                }
            ]
        }),
        controller = new TestController(chart);

    controller.mouseOver(
        chart.series[0].nodes[1].nodeX + chart.plotLeft + 50,
        chart.series[0].points[1].plotY + chart.plotTop + 5
    );

    chart.series[0].update({
        // Set `keys` to prevent using `setData()`
        keys: ['from', 'to', 'weight'],
        data: [
            ['Brazil', 'Portugal', 5],
            ['Portugal', 'England', 25]
        ]
    });

    assert.ok(
        true,
        'No errors when updating series after hovering a link (#10624).'
    );
});

QUnit.test('Sankey and circular data', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            width: 489
        },
        title: {
            text: 'Highcharts Sankey Diagram'
        },
        series: [
            {
                keys: ['from', 'to', 'weight'],
                data: [
                    ['a', 'b', 1],
                    ['a', 'c', 1],
                    ['b', 'c', 1]
                ],
                type: 'sankey',
                name: 'Sankey demo series'
            }
        ]
    });

    assert.ok(true, 'No errors with circular data (#10658).');

    chart.series[0].setData([
        ['a', 'c', 5],
        ['a', 'b', 5],
        ['b', 'd', 5],
        ['b', 'c', 5]
    ]);

    const numberOfCurves = chart.series[0].points[3].graphic
        .attr('d')
        .split(' ')
        .filter(item => item === 'C').length;
    assert.ok(
        numberOfCurves > 4,
        'The link should have a complex, circular structure, ' +
            'not direct (#12882)'
    );

    chart.series[0].setData([
        ['a', 'a', 1]
    ]);
    chart.series[0].redraw();

    const shapeArgs = chart.series[0].nodes[0].shapeArgs;
    assert.deepEqual(
        [shapeArgs.x, shapeArgs.y],
        [0, 0],
        '#16080: Node should still be in top left corner after redraw'
    );
});

QUnit.test('Sankey and minimum line width', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [
                {
                    minLinkWidth: 1,
                    keys: ['from', 'to', 'weight'],
                    data: [
                        ['Brazil', 'England', 1],
                        ['Canada', 'Portugal', 100000]
                    ],
                    type: 'sankey'
                }
            ]
        }),
        path = chart.series[0].data[0].graphic.d.split(' ');

    assert.ok(
        parseFloat(path[path.length - 2]) - parseFloat(path[2]) >= 1,
        true,
        'Lines are draw with minimal value (#7318).'
    );
});

QUnit.test('Sankey and node.level option', assert => {
    const chart = Highcharts.chart('container', {
        title: {
            text: 'Highcharts Sankey Diagram'
        },
        series: [
            {
                keys: ['from', 'to', 'weight', 'color'],
                data: [
                    ['Primary Oil', 'Oil Refineries', 34762592],
                    ['Oil Refineries', 'Oil: Supplied', 34549489],
                    ['Coal', 'Coal: Supplied', 13741144]
                ],
                type: 'sankey',
                nodes: [
                    {
                        id: 'Oil: Supplied',
                        level: 2,
                        color: '#121212'
                    },
                    {
                        id: 'Coal: Supplied',
                        level: 2,
                        color: '#E59400'
                    },
                    {
                        id: 'Oil Refineries',
                        level: 1,
                        color: '#121212'
                    },
                    {
                        id: 'Primary Oil',
                        level: 0,
                        color: '#121212'
                    }
                ],
                name: 'Sankey demo series'
            }
        ]
    });

    assert.deepEqual(
        chart.series[0].nodes.map(n => n.name),
        [
            'Primary Oil',
            'Coal',
            'Oil Refineries',
            'Oil: Supplied',
            'Coal: Supplied'
        ],
        'The level option should apply initially'
    );

    // Trigger redraw
    chart.setSize(undefined, 401);

    assert.deepEqual(
        chart.series[0].nodes.map(n => n.name),
        [
            'Primary Oil',
            'Coal',
            'Oil Refineries',
            'Oil: Supplied',
            'Coal: Supplied'
        ],
        'The level option should apply after redraw (#12374)'
    );
});

QUnit.test(
    'Zero node is shown in sankey/dependency wheel #12453',
    function (assert) {
        var chart = Highcharts.chart('container', {
            series: [
                {
                    keys: ['from', 'to', 'weight'],
                    data: [
                        ['Spain', 'France', 5],
                        ['Spain', 'Netherlands', 0],
                        ['Spain', 'UK', 1],
                        ['Poland', 'France', 0],
                        ['Germany', 'France', 5],
                        ['Poland', 'UK', 2]
                    ],
                    type: 'sankey'
                }
            ]
        });

        assert.strictEqual(
            Highcharts.defined(chart.series[0].nodes[4].graphic),
            false,
            'This node should not have the graphic (#12453)'
        );

        assert.strictEqual(
            Highcharts.defined(chart.series[0].nodes[4].dataLabel),
            false,
            'This node should not have the dataLabel (#12453)'
        );

        chart.series[0].update({
            data: [
                ['Spain', 'France', 5],
                ['Spain', 'Netherlands', 2],
                ['Spain', 'UK', 1],
                ['Poland', 'France', 0],
                ['Germany', 'France', 5],
                ['Poland', 'UK', 2]
            ]
        });

        assert.strictEqual(
            Highcharts.defined(chart.series[0].nodes[4].graphic),
            true,
            'This node should have the graphic after the update (#12453)'
        );

        assert.strictEqual(
            Highcharts.defined(chart.series[0].nodes[4].dataLabel),
            true,
            'This node should have the dataLabel after the update (#12453)'
        );

        assert.strictEqual(
            chart.series[0].nodes[4].id,
            'Netherlands',
            'This node id(position) should not been have changed ' +
                'after the update (#12453)'
        );
    }
);

QUnit.test('Test null data in sankey #12666', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [
            {
                keys: ['from', 'to', 'weight'],
                data: [
                    ['Coal', 'Transportation', 0],
                    ['Renewable', 'Transportation', 0],
                    ['Nuclear', 'Transportation', 2],

                    ['Coal', 'Industrial', 7],
                    ['Renewable', 'Industrial', 11],
                    ['Nuclear', 'Industrial', 0],

                    ['Coal', 'R&C', 1],
                    ['Renewable', 'R&C', 7],
                    ['Nuclear', 'R&C', 5],

                    ['Coal', 'Electric Power', 48],
                    ['Renewable', 'Electric Power', 11],
                    ['Nuclear', null, 52]
                ],
                type: 'sankey'
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].nodes[2].sum,
        59,
        'For this node value from the point with linkTo null should ' +
            'be added to sum (#12666)'
    );
});

QUnit.test('Wrong spacings when zero minLinkWidth #13308', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            height: 200
        },

        series: [
            {
                keys: ['from', 'to', 'weight'],
                nodePadding: 50,
                minLinkWidth: 0,
                data: [
                    ['Brazil', 'Portugal', 5],
                    ['Brazil', 'France', 1],
                    ['Canada', 'Portugal', 1],
                    ['Canada', 'France', 1000],
                    ['Portugal', 'Angola', 2],
                    ['Portugal', 'Senegal', 1],
                    ['Portugal', 'Morocco', 1]
                ],
                type: 'sankey'
            }
        ]
    });

    const nodeYBeforeUpdate = chart.series[0].nodes[1].nodeY,
        factorBeforeUpdate = chart.series[0].translationFactor,
        newMinLinkWidth = 5;

    chart.series[0].update({
        minLinkWidth: newMinLinkWidth
    });

    const nodeYAfterUpdate = chart.series[0].nodes[1].nodeY,
        factorAfterUpdate = chart.series[0].translationFactor;

    assert.close(
        nodeYAfterUpdate - nodeYBeforeUpdate,
        newMinLinkWidth,
        1,
        'For this node the difference of the nodeY value should be equal ' +
            'to the new minLinkWidth after the update (#13308)'
    );

    assert.close(
        factorBeforeUpdate,
        factorAfterUpdate,
        0.02,
        'The translate-factor value should not be changed significantly ' +
            'while changing the minLinkWidth (#13308)'
    );
});

QUnit.test('#14584: Sankey overlapping datalabels', assert => {
    const chart = Highcharts.chart('container', {
        plotOptions: {
            sankey: {
                dataLabels: {
                    allowOverlap: false,
                    padding: 0,
                    formatter: function () {
                        return 'links: ' + this.point.from;
                    },
                    nodeFormatter: function () {
                        return 'node: ' + this.key;
                    },
                    style: {
                        fontSize: '10px',
                        fontWeight: 'normal'
                    }
                }
            }
        },
        series: [
            {
                type: 'sankey',
                keys: ['from', 'to', 'weight'],
                data: [
                    ['Brazil', 'Portugal', 5],
                    ['Brazil', 'France', 1],
                    ['Brazil', 'Spain', 1],
                    ['Brazil', 'England', 1],
                    ['Canada', 'Portugal', 1],
                    ['Canada', 'France', 5],
                    ['Canada', 'England', 1],
                    ['Mexico', 'Portugal', 1],
                    ['Mexico', 'France', 1],
                    ['Mexico', 'Spain', 5],
                    ['Mexico', 'England', 1],
                    ['USA', 'Portugal', 1],
                    ['USA', 'France', 1],
                    ['USA', 'Spain', 1],
                    ['USA', 'England', 5],
                    ['Portugal', 'Angola', 2],
                    ['Portugal', 'Senegal', 1],
                    ['Portugal', 'Morocco', 1],
                    ['Portugal', 'South Africa', 3],
                    ['France', 'Angola', 1],
                    ['France', 'Senegal', 3],
                    ['France', 'Mali', 3],
                    ['France', 'Morocco', 3],
                    ['France', 'South Africa', 1],
                    ['Spain', 'Senegal', 1],
                    ['Spain', 'Morocco', 3],
                    ['Spain', 'South Africa', 1],
                    ['England', 'Angola', 1],
                    ['England', 'Senegal', 1],
                    ['England', 'Morocco', 2],
                    ['England', 'South Africa', 7],
                    ['South Africa', 'China', 5],
                    ['South Africa', 'India', 1],
                    ['South Africa', 'Japan', 3],
                    ['Angola', 'China', 5],
                    ['Angola', 'India', 1],
                    ['Angola', 'Japan', 3],
                    ['Senegal', 'China', 5],
                    ['Senegal', 'India', 1],
                    ['Senegal', 'Japan', 3],
                    ['Mali', 'China', 5],
                    ['Mali', 'India', 1],
                    ['Mali', 'Japan', 3],
                    ['Morocco', 'China', 5],
                    ['Morocco', 'India', 1],
                    ['Morocco', 'Japan', 3]
                ]
            }
        ]
    });

    assert.ok(
        chart.series[0].points.some(p => p.dataLabel.attr('opacity') === 0),
        'Some of the point datalabels should be hidden'
    );
});

QUnit.test('Sankey and point updates', assert => {
    const linkConfig = { from: 'A', to: 'B', weight: 1 },
        chart = Highcharts.chart('container', {
            series: [{
                data: [Highcharts.merge(linkConfig)], // use a shallow copy
                type: 'sankey',
                nodes: [{
                    id: 'A',
                    color: 'red'
                }]
            }]
        }),
        series = chart.series[0];

    // Test 1:
    // Uodate a node that exists in a config
    series.nodes[0].update({
        color: 'black'
    });

    assert.strictEqual(
        series.nodes[0].graphic.attr('fill'),
        'black',
        'After an update, node defined in options should use new color.'
    );

    assert.deepEqual(
        series.options.nodes[0].color,
        'black',
        `After an update,
        node defined in options should have correct color in options.`
    );

    assert.deepEqual(
        series.options.data[0],
        linkConfig,
        `Updating a node defined in options
        should not replace a link config (#11712).`
    );

    // Test 2:
    // Uodate a node that DOES NOT exist in a config
    series.nodes[1].update({
        color: 'green'
    });

    assert.strictEqual(
        series.options.nodes.length,
        2,
        `Updating a node without options,
        should create a new entry in options.`
    );

    assert.strictEqual(
        series.nodes[1].graphic.attr('fill'),
        'green',
        'After an update, node without config should use new color.'
    );

    assert.deepEqual(
        series.options.nodes[1].color,
        'green',
        `After an update,
        node without config should have correct color in options.`
    );

    assert.deepEqual(
        series.options.data[0],
        linkConfig,
        `Updating a node without config
        should not replace a link config (#11712).`
    );

    assert.strictEqual(
        series.options.data.length,
        1,
        `
        Udpating a node with higher index than available in series.options.data
        should not add any elements to the series.options.data
        `
    );
});
