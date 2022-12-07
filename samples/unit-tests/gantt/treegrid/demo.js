/**
 * Checks that tick labels belonging to child points are properly indented.
 */
QUnit.test('Indentation', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                type: 'scatter',
                marginLeft: 300
            },
            title: {
                text: 'Highcharts GridAxis'
            },
            xAxis: [
                {
                    type: 'datetime'
                }
            ],
            yAxis: [
                {
                    title: '',
                    grid: {
                        enabled: true
                    },
                    type: 'treegrid'
                }
            ],
            series: [
                {
                    name: 'Project 1',
                    data: [
                        {
                            name: 'Node 1',
                            id: '1',
                            x: Date.UTC(2014, 10, 18)
                        },
                        {
                            name: 'Node 2',
                            id: '2',
                            parent: '1',
                            x: Date.UTC(2014, 10, 20)
                        },
                        {
                            name: 'Node 3',
                            id: '3',
                            parent: '2',
                            x: Date.UTC(2014, 10, 22)
                        },
                        {
                            name: 'Node 4',
                            id: '4',
                            parent: '3',
                            x: Date.UTC(2014, 10, 24)
                        },
                        {
                            name: 'Node 5',
                            id: '5',
                            parent: '4',
                            x: Date.UTC(2014, 10, 26)
                        },
                        {
                            name: 'Node 6',
                            id: '6',
                            parent: '5',
                            x: Date.UTC(2014, 10, 28)
                        },
                        {
                            name: 'Node 7',
                            id: '7',
                            parent: '6',
                            x: Date.UTC(2014, 10, 30)
                        },
                        {
                            name: 'Node 8',
                            id: '8',
                            parent: '7',
                            x: Date.UTC(2014, 11, 2)
                        },
                        {
                            name: 'Node 9',
                            id: '9',
                            parent: '8',
                            x: Date.UTC(2014, 11, 4)
                        },
                        {
                            name: 'Node 10',
                            id: '10',
                            parent: '9',
                            x: Date.UTC(2014, 11, 6)
                        }
                    ]
                }
            ]
        }),
        treeGrid = chart.yAxis[0],
        ticks = treeGrid.ticks,
        tickPositions = treeGrid.tickPositions,
        tick1 = ticks[tickPositions[0]].label.element.getBBox(),
        tick2 = ticks[tickPositions[1]].label.element.getBBox(),
        tick3 = ticks[tickPositions[2]].label.element.getBBox();

    assert.ok(
        tick2.x > tick1.x,
        'Child point level 1 (Node 2) farther right than parent (Node 1)'
    );

    assert.ok(
        tick3.x > tick2.x,
        'Child point level 2 (Node 3) farther right than parent (Node 1)'
    );

    // #14904
    const { fireEvent } = Highcharts;
    var parentTick = ticks[tickPositions[0]].label.element,
        childTickIconY = ticks[tickPositions[1]].treeGrid.labelIcon.attr('y');

    // Click the parent node quickly twice (toggle drop-down)
    fireEvent(parentTick, 'click');
    fireEvent(parentTick, 'click');

    assert.strictEqual(
        childTickIconY,
        0,
        'Label icon should be shown after double clicking ' +
        'parent in drop-down. (#14904)'
    );
});

QUnit.test('Tree.getNode', function (assert) {
    var getNode = Highcharts.Axis.prototype.utils.getNode,
        mapOfIdToChildren = {
            test: [
                {
                    start: 5,
                    end: 10
                },
                {
                    start: 8,
                    end: 16
                }
            ]
        },
        node,
        data;

    // Test aggregation of start and end.
    node = getNode('test', null, 1, {}, mapOfIdToChildren);
    assert.strictEqual(
        node.data.start,
        5,
        'should use child.start when data.start is undefined.'
    );
    assert.strictEqual(
        node.data.end,
        16,
        'should use child.end when data.end is undefined.'
    );

    data = {
        start: 1,
        end: 2
    };
    node = getNode('test', null, 1, data, mapOfIdToChildren);
    assert.strictEqual(
        node.data.start,
        1,
        'should use data.start it is defined.'
    );
    assert.strictEqual(node.data.end, 2, 'should use data.end it is defined.');

    // Test aggregation of data from milestones.
    data = {};
    mapOfIdToChildren = {
        test: [
            {
                start: 1,
                milestone: true
            }
        ]
    };
    node = getNode('test', null, 1, data, mapOfIdToChildren);
    assert.strictEqual(
        node.data.start,
        1,
        'should use child.start as start if child is a milestone.'
    );
    assert.strictEqual(
        node.data.end,
        1,
        'should use child.start as end if child is a milestone.'
    );
});

QUnit.test('Axis.update', assert => {
    const { getStyle } = Highcharts;
    const {
        yAxis: [axis]
    } = Highcharts.chart('container', {
        series: [
            {
                data: [
                    {
                        name: 'Point 1',
                        y: 1
                    }
                ]
            }
        ],
        yAxis: {
            type: 'treegrid',
            labels: {
                style: {
                    color: '#000000'
                }
            }
        }
    });
    let {
        ticks: {
            0: {
                label: { element }
            }
        }
    } = axis;

    assert.deepEqual(
        axis.tickPositions,
        [0],
        'Should have tickPositions equal [0] after render.'
    );
    assert.strictEqual(
        getStyle(element, 'color', false),
        'rgb(0, 0, 0)',
        'Should have color equal rgb(0, 0, 0) after render.'
    );

    // Update the axis
    axis.update({
        labels: {
            style: {
                color: '#ff0000'
            }
        }
    });

    // Update reference to label element
    ({
        ticks: {
            0: {
                label: { element }
            }
        }
    } = axis);

    assert.deepEqual(
        axis.tickPositions,
        [0],
        'Should still have tickPositions equal [0] after update.'
    );
    assert.strictEqual(
        getStyle(element, 'color', false),
        'rgb(255, 0, 0)',
        'Should have color equal rgb(255, 0, 0) after update.'
    );
});

QUnit.test('Chart.addSeries', assert => {
    const chart = Highcharts.chart('container', {
        yAxis: [
            {
                type: 'treegrid'
            }
        ]
    });
    const series = {
        data: [
            {
                start: 1,
                end: 2,
                name: 'Category 1'
            },
            {
                start: 0,
                end: 3,
                name: 'Category 2'
            },
            {
                start: 2,
                end: 3,
                name: 'Category 3'
            }
        ]
    };
    const getYValues = ({ series }) =>
        series.reduce(
            (arr, series) => arr.concat(series.points.map(point => point.y)),
            []
        );

    assert.deepEqual(
        getYValues(chart),
        [],
        'should y values in the chart should equal []'
    );
    assert.strictEqual(
        chart.yAxis[0].min,
        undefined,
        'should have axis min equal to undefined when no series.'
    );
    assert.strictEqual(
        chart.yAxis[0].max,
        undefined,
        'should have axis max equal to undefined.'
    );

    chart.addSeries(series);
    assert.deepEqual(
        getYValues(chart),
        [0, 1, 2],
        'should y values in the chart should equal [0, 1, 2]'
    );
    assert.strictEqual(
        chart.yAxis[0].min,
        0,
        'should have axis min equal to 0.'
    );
    assert.strictEqual(
        chart.yAxis[0].max,
        2,
        'should have axis min equal to 0.'
    );
});

QUnit.test('Chart.addSeries collapsed', assert => {
    const chart = Highcharts.chart('container', {
        yAxis: [
            {
                type: 'treegrid'
            }
        ]
    });
    const series = {
        data: [
            {
                start: 0,
                end: 3,
                name: 'Category 1',
                id: 'cat1',
                collapsed: true
            },
            {
                parent: 'cat1',
                start: 2,
                end: 3,
                name: 'Category 2'
            }
        ]
    };
    chart.addSeries(series);

    assert.strictEqual(
        chart.renderTo.querySelectorAll('.highcharts-treegrid-node-collapsed')
            .length,
        1,
        'should have one collapsed node'
    );
});

QUnit.test('Series.setVisible', assert => {
    const {
        series: [series1, series2, series3],
        yAxis: [axis]
    } = Highcharts.chart('container', {
        series: [0, 1, 2].map(x => ({
            data: [{ x, name: `Point ${x + 1}` }]
        })),
        legend: { enabled: true },
        yAxis: [{ type: 'treegrid' }]
    });

    assert.strictEqual(
        series1.points[0].y,
        0,
        'should have "Point 1" y-value equal 0.'
    );
    assert.strictEqual(
        series2.points[0].y,
        1,
        'should have "Point 2" y-value equal 1.'
    );
    assert.strictEqual(
        series3.points[0].y,
        2,
        'should have "Point 3" y-value equal 3.'
    );
    assert.deepEqual(
        [axis.min, axis.max],
        [0, 2],
        'should have axis [min, max] equal [0, 2].'
    );

    series2.hide();
    assert.strictEqual(
        series1.points[0].y,
        0,
        'should have "Point 1" y-value equal 0 when "Series 2" is hidden.'
    );
    assert.strictEqual(
        series3.points[0].y,
        1,
        'should have "Point 3" y-value equal 1  when "Series 2" is hidden.'
    );
    assert.strictEqual(
        series2.visible,
        false,
        'should have "Series 2" visible equal false.'
    );
    assert.deepEqual(
        [axis.min, axis.max],
        [0, 1],
        'should have axis [min, max] equal [0, 1]  when "Series 2" is hidden.'
    );

    series2.show();
    assert.strictEqual(
        series1.points[0].y,
        0,
        'should have "Point 1" y-value equal 0 when "Series 2" is visible again.'
    );
    assert.strictEqual(
        series2.points[0].y,
        1,
        'should have "Point 2" y-value equal 1 when "Series 2" is visible again.'
    );
    assert.strictEqual(
        series3.points[0].y,
        2,
        'should have "Point 3" y-value equal 3 when "Series 2" is visible again.'
    );
    assert.deepEqual(
        [axis.min, axis.max],
        [0, 2],
        'should have axis [min, max] equal [0, 2] when "Series 2" is visible again.'
    );
});

QUnit.test('series.data[].collapsed', assert => {
    const { fireEvent } = Highcharts;
    const chart = Highcharts.chart('container', {
        yAxis: [
            {
                type: 'treegrid'
            }
        ],
        series: [
            {
                type: 'scatter',
                data: [
                    {
                        collapsed: true,
                        id: '1',
                        name: 'Node 1',
                        x: 1
                    },
                    {
                        id: '2',
                        parent: '1',
                        name: 'Node 2',
                        x: 2
                    },
                    {
                        id: '3',
                        parent: '2',
                        name: 'Node 3',
                        x: 3
                    }
                ]
            }
        ]
    });
    const {
        yAxis: [axis]
    } = chart;
    const label = axis.ticks[0].label;

    assert.strictEqual(
        axis.min,
        0,
        'should have axis.min equal 0 when "Node 1" is collapsed.'
    );
    assert.strictEqual(
        axis.max,
        0,
        'should have axis.max equal 0 when "Node 1" is collapsed.'
    );

    fireEvent(label.element, 'click');
    assert.strictEqual(
        axis.min,
        0,
        'should have axis.min equal 0 when "Node 1" is expanded.'
    );
    assert.strictEqual(
        axis.max,
        2,
        'should have axis.max equal 2 when "Node 1" is expanded.'
    );

    assert.strictEqual(
        axis.series[0].points[0].collapsed,
        false,
        'This point should be expanded #13838'
    );

    assert.strictEqual(
        axis.series[0].options.data[0].collapsed,
        false,
        'This point should be expanded #13838'
    );

    chart.series[0].setData([], true, true, false);
    assert.notOk(
        document.querySelector('.highcharts-label-icon'),
        `After updating data,
        the unnecessary label icons should be removed, 16673.`
    );
});
