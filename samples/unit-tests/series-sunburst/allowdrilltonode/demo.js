QUnit.test('Drill to node by click events', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                type: 'sunburst',
                allowDrillToNode: true,
                data: [{
                    id: 'level-1'
                }, {
                    id: 'level-2',
                    parent: 'level-1'
                }, {
                    id: 'level-3',
                    parent: 'level-2',
                    value: 1
                }, {
                    value: 1
                }]
            }]
        }),
        series = chart.series[0],
        testController = new TestController(chart),
        click = function (point) {
            var x = chart.plotLeft + point.plotX,
                y = chart.plotTop + point.plotY;
            testController.triggerEvent('mouseover', x, y);
            testController.triggerEvent('click', x, y);
        },
        findPointById = function (id) {
            return Highcharts.find(series.points, function (point) {
                return point.id === id;
            });
        },
        level1 = findPointById('level-1'),
        level2 = findPointById('level-2'),
        level3 = findPointById('level-3');

    assert.strictEqual(
        series.rootNode,
        '',
        'should have series.rootNode equal "" by default.'
    );

    click(level2);
    assert.strictEqual(
        series.rootNode,
        'level-2',
        'should drill down to level-2 after clicking on level-2.'
    );

    click(level2);
    assert.strictEqual(
        series.rootNode,
        'level-1',
        'should drill up to level-1 after clicking on level-2 when it is root.'
    );

    click(level1);
    assert.strictEqual(
        series.rootNode,
        '',
        'should drill up to top level when clicking on level-1.'
    );

    click(level3);
    assert.strictEqual(
        series.rootNode,
        '',
        'should not drill down when clicking on a leaf node.'
    );
});
