QUnit.test('Check tooltip position for different axis options (#6327).', function (assert) {
    var chart = Highcharts.chart('container', {
            yAxis: [{
                top: 40,
                height: 100
            }, {
                top: 200,
                height: 80
            }],
            series: [{
                data: [1, 2, 3],
                id: 's1'
            }, {
                data: [1, 2, 3],
                id: 's2',
                yAxis: 1
            }, {
                type: 'flags',
                onSeries: 's1',
                data: [{
                    x: 1,
                    title: 'B'
                }]
            }, {
                type: 'flags',
                onSeries: 's2',
                data: [{
                    x: 1,
                    title: 'L'
                }],
                yAxis: 1
            }]
        }),
        yAxis0 = chart.yAxis[0],
        yAxis1 = chart.yAxis[1],
        ser0 = chart.series[2],
        ser1 = chart.series[3],
        flag0 = ser0.points[0],
        flag1 = ser1.points[0],
        controller = new TestController(chart);

    assert.strictEqual(
        flag0.tooltipPos[1],
        flag0.plotY + yAxis0.pos - chart.plotTop + ser0.options.y,
        'Tooltip will be correctly placed for the top flag'
    );
    assert.strictEqual(
        flag1.tooltipPos[1],
        flag1.plotY + yAxis1.pos - chart.plotTop + ser0.options.y,
        'Tooltip will be correctly placed for the bottom flag'
    );

    yAxis1.update({
        max: 2.5,
        endOnTick: false
    });

    controller.mouseOver(
        chart.series[1].points[1].plotX + yAxis1.left,
        chart.series[1].points[1].plotY + yAxis1.top - 20
    );

    assert.strictEqual(
        chart.tooltip.isHidden,
        true,
        'Flag clipped (#8546).'
    );
});
