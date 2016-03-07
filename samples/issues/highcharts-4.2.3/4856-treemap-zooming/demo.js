QUnit.test('Axis extremes after zooming or drillToNode in Treemap', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                zoomType: "xy"
            },
            colorAxis: {
                minColor: '#FFFFFF',
                maxColor: Highcharts.getOptions().colors[0]
            },
            series: [{
                type: 'treemap',
                layoutAlgorithm: 'squarified',
                data: [{
                    id: 'A',
                    name: 'A',
                    value: 6,
                    colorValue: 1
                }, {
                    name: 'B',
                    value: 3,
                    colorValue: 2
                }, {
                    name: 'C',
                    value: 3,
                    colorValue: 3
                }, {
                    parent: 'A',
                    name: 'A1',
                    value: 3,
                    colorValue: 4
                }, {
                    parent: 'A',
                    name: 'A2',
                    value: 2,
                    colorValue: 5
                }]
            }],
            title: {
                text: 'Highcharts Treemap'
            }
        }),
        xAxis = chart.xAxis[0],
        extremes;

    // Zoom should work when enabled
    xAxis.zoom(80, 100);
    chart.redraw();
    extremes = xAxis.getExtremes();
    assert.strictEqual(
        extremes.min,
        80,
        'xAxis.min is correct according to zoom'
    );
    assert.strictEqual(
        extremes.max,
        100,
        'xAxis.max is correct according to zoom'
    );

    // When allowDrillToNode the extremes should be the same as the point values of the root node.
    chart.series[0].update({
        allowDrillToNode: true
    });
    chart.series[0].drillToNode('A');
    extremes = xAxis.getExtremes();
    assert.strictEqual(
        extremes.min,
        0,
        'xAxis.min is matching the root node'
    );
    assert.strictEqual(
        extremes.max,
        50,
        'xAxis.max is matching the root node'
    );

    // When allowDrillToNode extremes should be unaffected by zoom.
    xAxis.zoom(80, 100);
    extremes = xAxis.getExtremes();
    assert.strictEqual(
        extremes.min,
        0,
        'xAxis.min is unaffected by zoom'
    );
    assert.strictEqual(
        extremes.max,
        50,
        'xAxis.max is unaffected by zoom'
    );
});
