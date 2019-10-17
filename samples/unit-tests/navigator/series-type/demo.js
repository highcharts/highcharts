QUnit.test('Column type navigator', function (assert) {
    var chart = Highcharts.stockChart('container', {
            navigator: {
                series: {
                    type: 'column',
                    pointRange: null
                }
            },
            series: [{
                type: 'column',
                data: [10, 20, 30, 10, 20, 30, 10, 20, 30]
            }]
        }),
        nav = chart.navigator,
        navGroupBox = nav.navigatorGroup.getBBox(),
        controller = new TestController(chart),
        xAxis = chart.xAxis[0];

    assert.strictEqual(
        nav.handles[0].attr('translateX'),
        nav.left,
        'LEFT handle should be rendered at the most LEFT position'
    );

    assert.strictEqual(
        nav.handles[1].attr('translateX'),
        nav.left + nav.size,
        'RIGHT handle should be rendered at the most RIGHT position'
    );

    controller.mouseDown(
        nav.handles[0].attr('translateX'),
        navGroupBox.y + nav.height / 2
    );

    controller.mouseMove(
        nav.handles[1].attr('translateX'),
        navGroupBox.y + nav.height / 2
    );

    controller.mouseUp(
        nav.handles[1].attr('translateX'),
        navGroupBox.y + nav.height / 2
    );

    assert.strictEqual(
        xAxis.max - xAxis.min,
        xAxis.minRange,
        'It should not be possible to zoom below minRange'
    );

    assert.close(
        nav.handles[0].attr('translateX') + nav.scrollbarHeight / 2,
        chart.xAxis[1].toPixels(xAxis.min, true),
        1,
        'Left handle should be rendered between points: x=2 and x=3'
    );
});