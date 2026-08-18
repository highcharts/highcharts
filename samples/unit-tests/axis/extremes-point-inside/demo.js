QUnit.test('#25050: point on an axis extreme is inside', assert => {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 250
        },
        yAxis: {
            len: 220,
            min: 0,
            max: 100
        },
        series: [{
            type: 'line',
            data: [0, 50, 100]
        }]
    });

    var point = chart.series[0].points[2];

    // The point sits exactly on yAxis.max. Its plotY must be exactly 0 - not a
    // tiny negative floating-point residue (e.g. -2.8e-14) that tips both
    // Series#isPointInside and Chart#isInsidePlot into treating it as outside
    // the plot area.
    assert.strictEqual(
        point.plotY,
        0,
        'point.plotY on the axis extreme should be exactly 0'
    );

    assert.strictEqual(
        point.isInside,
        true,
        'point on the axis extreme should be inside the plot area'
    );

    assert.ok(
        point.graphic,
        'marker should be rendered for a point on the axis extreme'
    );

    chart.destroy();
});
