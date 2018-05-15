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
            xAxis: [{
                type: 'datetime'
            }],
            yAxis: [{
                title: '',
                grid: true,
                type: 'tree-grid'
            }],
            series: [{
                name: 'Project 1',
                data: [{
                    name: 'Node 1',
                    id: '1',
                    x: Date.UTC(2014, 10, 18)
                }, {
                    name: 'Node 2',
                    id: '2',
                    parent: '1',
                    x: Date.UTC(2014, 10, 20)
                }, {
                    name: 'Node 3',
                    id: '3',
                    parent: '2',
                    x: Date.UTC(2014, 10, 22)
                }, {
                    name: 'Node 4',
                    id: '4',
                    parent: '3',
                    x: Date.UTC(2014, 10, 24)
                }, {
                    name: 'Node 5',
                    id: '5',
                    parent: '4',
                    x: Date.UTC(2014, 10, 26)
                }, {
                    name: 'Node 6',
                    id: '6',
                    parent: '5',
                    x: Date.UTC(2014, 10, 28)
                }, {
                    name: 'Node 7',
                    id: '7',
                    parent: '6',
                    x: Date.UTC(2014, 10, 30)
                }, {
                    name: 'Node 8',
                    id: '8',
                    parent: '7',
                    x: Date.UTC(2014, 11, 2)
                }, {
                    name: 'Node 9',
                    id: '9',
                    parent: '8',
                    x: Date.UTC(2014, 11, 4)
                }, {
                    name: 'Node 10',
                    id: '10',
                    parent: '9',
                    x: Date.UTC(2014, 11, 6)
                }]
            }]
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
});
