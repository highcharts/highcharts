QUnit.test('Arc shape', function (assert) {
    let selectionShape;

    const chart = Highcharts.chart('container', {
            chart: {
                zoomType: 'xy',
                polar: true,
                events: {
                    selection: function () {
                        selectionShape =
                            this.pointer.selectionMarker.element.getAttribute('d');
                    }
                }
            },
            series: [{
                type: 'column',
                data: [8, 7, 6, 5, 4, 3, 2, 1]
            }]
        }),
        controller = new TestController(chart);

    let [centerX, centerY] = chart.pane[0].center;

    centerX += chart.plotLeft;
    centerY += chart.plotTop;

    controller.mouseDown(centerX - 50, centerY);
    controller.mouseMove(centerX + 100, centerY);
    controller.mouseUp();

    assert.ok(
        /\sA|a\s/gu.test(selectionShape),
        'Selection should be arc shaped'
    );
});

QUnit.test('Axes zoom', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            polar: true,
            zoomType: 'y'
        },
        pane: {
            size: 200
        },
        yAxis: {
            endOnTick: false,
            max: 8
        },
        series: [{
            type: 'column',
            data: [2, 4, 6, 8]
        }]
    });

    const controller = new TestController(chart),
        [centerX, centerY, diameter] = chart.pane[0].center,
        min = 4,
        max = 8,
        xPos = centerX + chart.plotLeft,
        minPosY = chart.yAxis[0].toPixels(min) + centerY - diameter / 2,
        maxPosY = chart.yAxis[0].toPixels(max) + centerY - diameter / 2;

    controller.mouseDown(xPos, minPosY);
    controller.mouseMove(xPos, maxPosY);
    controller.mouseUp();

    assert.strictEqual(
        chart.yAxis[0].getExtremes().min,
        min,
        'Zooming from 4 to 8 should set correct min'
    );

    assert.strictEqual(
        chart.yAxis[0].getExtremes().max,
        max,
        'Zooming from 4 to 8 should set correct min'
    );

    chart.yAxis[0].setExtremes(0, 8);

    controller.mouseDown(xPos, maxPosY);
    controller.mouseMove(xPos, minPosY);
    controller.mouseUp();

    assert.strictEqual(
        chart.yAxis[0].getExtremes().min,
        min,
        'Zooming from 8 to 4 should set correct min'
    );

    assert.strictEqual(
        chart.yAxis[0].getExtremes().max,
        max,
        'Zooming from 8 to 4 should set correct max'
    );
});