QUnit.test('No animation', function (assert) {
    var chart = Highcharts.charts[0],
        point = chart.series[0].points[0],
        bBox;

    chart.series[0].points[0].update(200);
    assert.strictEqual(
        point.graphic.attr('y') + point.graphic.attr('r'),
        point.series.yAxis.toPixels(point.y, true),
        'Point is placed sync'
    );
});