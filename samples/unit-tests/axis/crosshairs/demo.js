QUnit.test('snap', function (assert) {
    var chart = Highcharts.chart('container', {
            xAxis: {
                crosshair: {
                    snap: true
                }
            },
            yAxis: {
                crosshair: {
                    snap: true
                }
            },
            plotOptions: {
                series: {
                    kdNow: true
                }
            },
            series: [{
                type: 'bubble',
                data: [
                    [1, 1, 1]
                ]
            }]
        }),
        point = chart.series[0].points[0],
        xAxis = chart.xAxis[0],
        yAxis = chart.yAxis[0];

    assert.strictEqual(
        !!xAxis.cross,
        false,
        'before interaction: crosshair on xAxis is not drawn.'
    );
    assert.strictEqual(
        !!yAxis.cross,
        false,
        'before interaction: crosshair on yAxis is not drawn.'
    );

    point.onMouseOver();
    assert.strictEqual(
        !!xAxis.cross,
        true,
        'mouseOver: crosshair on xAxis is added.'
    );
    assert.strictEqual(
        !!yAxis.cross,
        true,
        'mouseOver: crosshair on yAxis is added.'
    );

    // TODO Remove crosshairs on mouseOut
    // point.onMouseOut();
    // assert.strictEqual(
    //     !!xAxis.cross,
    //     false,
    //     'mouseOut: crosshair on xAxis is removed.'
    // );
    // assert.strictEqual(
    //     !!yAxis.cross,
    //     false,
    //     'mouseOut: crosshair on yAxis is removed.'
    // );

    // TODO Test positioning of crosshairs.
});