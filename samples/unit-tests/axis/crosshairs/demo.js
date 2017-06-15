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

QUnit.test('Show only one snapping crosshair at the same time. #6420', function (assert) {
    var chart = Highcharts.chart('container', {
            xAxis: [{
                crosshair: true
            }, {
                opposite: true,
                crosshair: true
            }],
            series: [{
                name: 'Installation',
                data: [1, 2, 3],
                xAxis: 0
            }, {
                name: 'Manufacturing',
                data: [1, 2, 3].reverse(),
                xAxis: 1
            }]
        }),
        series1 = chart.series[0],
        series2 = chart.series[1];

    series1.points[0].onMouseOver();
    assert.strictEqual(
        series1.xAxis.cross.attr('visibility'),
        'visible',
        'Hover Series 1: crosshair on xAxis of Series 1 is visible'
    );
    assert.strictEqual(
        !!series2.xAxis.cross,
        false,
        'Hover Series 1: crosshair on xAxis of Series 2 does not exist'
    );

    series2.points[2].onMouseOver();
    assert.strictEqual(
        series1.xAxis.cross.attr('visibility'),
        'hidden',
        'Hover Series 2: crosshair on xAxis of Series 1 is hidden'
    );
    assert.strictEqual(
        series2.xAxis.cross.attr('visibility'),
        'visible',
        'Hover Series 2: crosshair on xAxis of Series 2 is visible'
    );
});
