QUnit.test('No animation', function (assert) {
    var chart = Highcharts.charts[0],
        point = chart.series[0].points[0];

    chart.series[0].points[0].update(200);
    assert.strictEqual(
        point.graphic.attr('y') + point.graphic.attr('height') / 2,
        point.series.yAxis.toPixels(point.y, true),
        'Point is placed sync'
    );
});
