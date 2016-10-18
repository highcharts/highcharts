QUnit.test('Animation duration', function (assert) {
    var chart = Highcharts.charts[0],
        point = chart.series[0].points[0],
        initialPos = point.series.yAxis.toPixels(point.y, true),
        bBox,
        realPos,
        done = assert.async();

    chart.series[0].points[0].update(200);

    realPos = point.graphic.attr('y') + point.graphic.attr('r');
    assert.strictEqual(
        realPos,
        initialPos,
        'Time 0 - point has not started moving'
    );

    setTimeout(function () {
        assert.strictEqual(
            point.graphic.attr('y') + point.graphic.attr('r') < realPos,
            true,
            'Time 400 - point has continued'
        );
        realPos = point.graphic.attr('y') + point.graphic.attr('r');
    }, 400);

    setTimeout(function () {
        assert.strictEqual(
            point.graphic.attr('y') + point.graphic.attr('r') < realPos,
            true,
            'Time 800 - point has continued'
        );

    }, 800);

    setTimeout(function () {
        assert.strictEqual(
            point.graphic.attr('y') + point.graphic.attr('r'),
            point.series.yAxis.toPixels(point.y, true),
            'Time 1200 - point has landed'
        );

        done();
    }, 1200);

});