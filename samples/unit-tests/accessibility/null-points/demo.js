QUnit.test('Null points are described to screen readers', function (assert) {
    const chart = Highcharts.chart('container', {
            series: [{
                data: [1, null, null, 2, 3, 4, 5, 6]
            }]
        }),
        series = chart.series[0],
        regularPoint = series.points[0],
        nullPoint = series.points[1],
        getPointAttr = (point, attr) => point.graphic.element.getAttribute(attr);

    assert.ok(getPointAttr(regularPoint, 'aria-label'));
    assert.ok(getPointAttr(nullPoint, 'aria-label'));
});
