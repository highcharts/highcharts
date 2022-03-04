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
    // start with mouseMove to make sure that chart.hoverPane exists
    controller.mouseMove(centerX - 50, centerY);
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
        xAxis: {
            max: 8
        },
        series: [{
            pointPlacement: 'between',
            type: 'column',
            data: [2, 4, 6, 8]
        }]
    });

    const controller = new TestController(chart),
        [centerX, centerY, diameter] = chart.pane[0].center,
        minY = 4,
        maxY = 8,
        xPos = centerX + chart.plotLeft,
        minPosY = chart.yAxis[0].toPixels(minY) + centerY - diameter / 2,
        maxPosY = chart.yAxis[0].toPixels(maxY) + centerY - diameter / 2;

    controller.mouseMove(xPos, minPosY);
    controller.mouseDown(xPos, minPosY);
    controller.mouseMove(xPos, maxPosY);
    controller.mouseUp();

    assert.strictEqual(
        chart.yAxis[0].getExtremes().min,
        minY,
        `Zooming y axis from ${minY} to ${maxY} should set correct min`
    );

    assert.strictEqual(
        chart.yAxis[0].getExtremes().max,
        maxY,
        `Zooming y axis from ${minY} to ${maxY} should set correct max`
    );

    chart.yAxis[0].setExtremes();

    controller.mouseDown(xPos, maxPosY);
    controller.mouseMove(xPos, minPosY);
    controller.mouseUp();

    assert.strictEqual(
        chart.yAxis[0].getExtremes().min,
        minY,
        `Zooming y axis from ${maxY} to ${minY} should set correct min`
    );

    assert.strictEqual(
        chart.yAxis[0].getExtremes().max,
        maxY,
        `Zooming y axis from ${maxY} to ${minY} should set correct max`
    );

    chart.update({
        chart: {
            zoomType: 'x'
        }
    });

    const minX = 4,
        maxX = 6,
        yPos = centerY + chart.plotTop;

    controller.mouseDown(xPos, yPos + diameter / 4);
    controller.mouseMove(xPos - diameter / 4, yPos);
    controller.mouseUp();

    assert.strictEqual(
        chart.xAxis[0].getExtremes().min,
        minX,
        `Zooming x axis from ${minX} to ${maxX} should set correct min`
    );

    assert.strictEqual(
        chart.xAxis[0].getExtremes().max,
        maxX,
        `Zooming x axis from ${minX} to ${maxX} should set correct max`
    );

    chart.xAxis[0].setExtremes();

    controller.mouseDown(xPos - diameter / 4, yPos);
    controller.mouseMove(xPos, yPos + diameter / 4);
    controller.mouseUp();

    assert.strictEqual(
        chart.xAxis[0].getExtremes().min,
        minX,
        `Zooming x axis from ${maxX} to ${minX} should set correct min`
    );

    assert.strictEqual(
        chart.xAxis[0].getExtremes().max,
        maxX,
        `Zooming x axis from ${maxX} to ${minX} should set correct max`
    );

    chart.xAxis[0].setExtremes();
    chart.yAxis[0].setExtremes();

    chart.update({
        chart: {
            zoomType: 'xy'
        }
    });

    controller.mouseDown(xPos - diameter / 4, yPos);
    controller.mouseMove(xPos, yPos + diameter / 2);
    controller.mouseUp();

    assert.deepEqual(
        [chart.xAxis[0].getExtremes().min, chart.yAxis[0].getExtremes().min],
        [minX, minY],
        `Zooming xy from (x1: ${maxX}, y1: ${minY})
        to (x2: ${minX}, y2: ${maxY}) should set correct min`
    );

    assert.deepEqual(
        [chart.xAxis[0].getExtremes().max, chart.yAxis[0].getExtremes().max],
        [maxX, maxY],
        `Zooming xy from (x1: ${maxX}, y1: ${minY})
        to (x2: ${minX}, y2: ${maxY}) should set correct max`
    );
});