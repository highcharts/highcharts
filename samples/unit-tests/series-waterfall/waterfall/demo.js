QUnit.test('General waterfall tests', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'waterfall'
        },
        series: [{
            minPointLength: 20,
            data: [5, 0.0001, null, 10, -0.0001, null, 0.0001, null, 5, { isSum: true }]
        }]
    });

    assert.ok(
        chart.series[0].points[chart.series[0].points.length - 1].shapeArgs.y,
        chart.yAxis[0].toPixels(20.0001),
        'MinPointLength doesn\'t influence data rendering (#6062).'
    );

    chart.series[0].update({
        data: [{
            y: null
        }],
        stacking: 'normal'
    });

    assert.ok(1, 'No errors when stacking null points (#7667).');
});