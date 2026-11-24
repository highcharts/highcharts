QUnit.test('Pitchfork median on a logarithmic axis, #24851', function (assert) {
    const chart = Highcharts.chart('container', {
        yAxis: {
            type: 'logarithmic'
        },
        annotations: [{
            type: 'pitchfork',
            typeOptions: {
                points: [{
                    x: 1,
                    y: 2
                }, {
                    x: 4,
                    y: 8
                }, {
                    x: 4,
                    y: 2
                }]
            }
        }],
        series: [{
            data: [1, 2, 4, 8, 4, 2]
        }]
    });

    const annotation = chart.annotations[0],
        yAxis = chart.yAxis[0],
        outer = annotation.points,
        mid = annotation.midPointOptions(),
        pixelMid = (
            yAxis.toPixels(outer[1].y, true) +
            yAxis.toPixels(outer[2].y, true)
        ) / 2,
        innerTop = annotation.shapes[3].points[0],
        innerBottom = annotation.shapes[3].points[3];

    assert.close(
        yAxis.toPixels(mid.y, true),
        pixelMid,
        0.001,
        'Median plotY should match the pixel midpoint of the outer points.'
    );

    assert.close(
        innerTop.plotY,
        (outer[1].plotY + yAxis.toPixels(mid.y, true)) / 2,
        0.001,
        'Inner top edge plotY should match the midpoint between the top ' +
        'point and the median.'
    );

    assert.close(
        innerBottom.plotY,
        (yAxis.toPixels(mid.y, true) + outer[2].plotY) / 2,
        0.001,
        'Inner bottom edge plotY should match the midpoint between the ' +
        'median and the bottom point.'
    );

    chart.update({
        yAxis: {
            type: 'linear'
        }
    });

    assert.close(
        chart.annotations[0].midPointOptions().y,
        5,
        0.001,
        'Median y should be the arithmetic mean on a linear axis.'
    );
});
