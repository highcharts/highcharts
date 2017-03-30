QUnit.test('Null points with minPointLength (#6062)', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                type: 'waterfall'
            },
            series: [{
                minPointLength: 20,
                data: [5, 0.0001, null, 10, -0.0001, null, 0.0001, null, 5, {isSum: true}]
            }]
        }),
        points = chart.series[0].points;

    assert.ok(
        chart.series[0].points[chart.series[0].points.length - 1].shapeArgs.y,
        chart.yAxis[0].toPixels(20.0001),
        'MinPointLength doesn\'t influence data rendering.'
    );
});
