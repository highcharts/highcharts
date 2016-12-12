QUnit.test('Null points with minPointLength (#6062)', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                type: 'waterfall'
            },
            series: [{
                minPointLength: 20,
                data: [5, 0.0001, null, 10, -0.0001, null, 0.0001, null, 5]
            }]
        }),
        points = chart.series[0].points,
        pointLength = points.length,
        point,
        i = 1;

    for (; i < pointLength; i++) {
        point = points[i];
        prev = points[i - 1];
        assert.strictEqual(
            Math.floor(prev.shapeArgs.y + prev.shapeArgs.height *
                (prev.y < 0 ? 1 : 0)),
            Math.floor(point.shapeArgs.y + point.shapeArgs.height *
                (point.y < 0 ? 0 : 1)),
            'Points: ' + (i - 1) + ' and ' + i +
                ' are connected at the correct height'
        );
    };
});
