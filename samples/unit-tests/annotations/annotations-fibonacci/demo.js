QUnit.test('Fibonacci level on a logarithmic axis, #24851', function (assert) {
    const chart = Highcharts.chart('container', {
        yAxis: {
            type: 'logarithmic'
        },
        annotations: [{
            type: 'fibonacci',
            typeOptions: {
                points: [{
                    x: 1,
                    y: 2
                }, {
                    x: 4,
                    y: 8
                }]
            }
        }],
        series: [{
            data: [1, 2, 4, 8, 4, 2]
        }]
    });

    const annotation = chart.annotations[0],
        yAxis = chart.yAxis[0],
        points = annotation.points,
        half = annotation.startRetracements[3];

    assert.close(
        yAxis.toPixels(half.y, true),
        (
            yAxis.toPixels(points[0].y, true) +
            yAxis.toPixels(points[3].y, true)
        ) / 2,
        0.001,
        'The 50% Fibonacci level plotY should match the pixel midpoint of ' +
        'the range.'
    );
});
