QUnit.test('Arc shape', function (assert) {
    let selectionShape;

    const chart = Highcharts.chart('container', {
            chart: {
                zooming: {
                    type: 'xy'
                },
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
            zooming: {
                type: 'y'
            }
        },
        pane: {
            size: 200
        },
        yAxis: {
            minRange: 1,
            startOnTick: false,
            endOnTick: false,
            max: 8
        },
        xAxis: {
            max: 8
        },
        series: [{
            pointPlacement: 'between',
            type: 'column',
            data: [1, 2, 3, 4, 5, 6, 7, 8]
        }, {
            pointPlacement: 'between',
            type: 'scatter',
            data: [1, 2, 3, 4, 5, 6, 7, 8]
        }]
    });

    let minY = 4,
        maxY = 8;

    const controller = new TestController(chart),
        [centerX, centerY, diameter] = chart.pane[0].center,
        xPos = centerX + chart.plotLeft,
        minPosY = chart.yAxis[0].toPixels(minY) + centerY - diameter / 2,
        maxPosY = chart.yAxis[0].toPixels(maxY) + centerY - diameter / 2;

    controller.mouseMove(xPos, minPosY);
    controller.mouseDown(xPos, minPosY);
    controller.mouseMove(xPos, maxPosY);
    controller.mouseUp(xPos, maxPosY);

    assert.close(
        chart.yAxis[0].getExtremes().min,
        minY,
        0.1,
        `Zooming y axis from ${minY} to ${maxY} should set correct min`
    );

    assert.close(
        chart.yAxis[0].getExtremes().max,
        maxY,
        0.1,
        `Zooming y axis from ${minY} to ${maxY} should set correct max`
    );

    chart.yAxis[0].setExtremes();

    controller.mouseDown(xPos, maxPosY);
    controller.mouseMove(xPos, minPosY);
    controller.mouseUp();

    assert.close(
        chart.yAxis[0].getExtremes().min,
        minY,
        0.1,
        `Zooming y axis from ${maxY} to ${minY} should set correct min`
    );

    assert.close(
        chart.yAxis[0].getExtremes().max,
        maxY,
        0.1,
        `Zooming y axis from ${maxY} to ${minY} should set correct max`
    );

    chart.update({
        chart: {
            zooming: {
                type: 'x'
            }
        }
    });

    let minX = 4,
        maxX = 6;

    const yPos = centerY + chart.plotTop;


    controller.mouseMove(xPos, yPos + diameter / 4);
    controller.mouseDown(xPos, yPos + diameter / 4);
    controller.mouseMove(xPos - diameter / 4, yPos);
    controller.mouseUp();

    assert.close(
        chart.xAxis[0].getExtremes().min,
        minX,
        0.1,
        `Zooming x axis from ${minX} to ${maxX} should set correct min`
    );

    assert.close(
        chart.xAxis[0].getExtremes().max,
        maxX,
        0.1,
        `Zooming x axis from ${minX} to ${maxX} should set correct max`
    );

    chart.xAxis[0].setExtremes();

    controller.mouseDown(xPos - diameter / 4, yPos);
    controller.mouseMove(xPos, yPos + diameter / 4);
    controller.mouseUp();

    assert.close(
        chart.xAxis[0].getExtremes().min,
        minX,
        0.1,
        `Zooming x axis from ${maxX} to ${minX} should set correct min`
    );

    assert.close(
        chart.xAxis[0].getExtremes().max,
        maxX,
        0.1,
        `Zooming x axis from ${maxX} to ${minX} should set correct max`
    );

    chart.xAxis[0].setExtremes();
    chart.yAxis[0].setExtremes();

    chart.update({
        chart: {
            zooming: {
                type: 'xy'
            }
        }
    });

    controller.mouseDown(xPos - diameter / 4, yPos);
    controller.mouseMove(xPos, yPos + diameter / 2);
    controller.mouseUp();

    [
        ['xAxis', 'min', minX],
        ['yAxis', 'min', minY],
        ['xAxis', 'max', maxX],
        ['yAxis', 'max', maxY]
    ].forEach(([axisName, extremeName, expected]) => {
        assert.close(
            chart[axisName][0].getExtremes()[extremeName],
            expected,
            0.1,
            `Zooming xy from (x1: ${maxX}, y1: ${minY})
            to (x2: ${minX}, y2: ${maxY}) should set correct ${axisName}
            ${extremeName}`
        );
    });

    chart.xAxis[0].setExtremes();
    chart.yAxis[0].setExtremes();

    chart.series.forEach(series => {
        const pointsGraphics = series.points.map(p => typeof p.graphic);

        assert.deepEqual(
            pointsGraphics,
            new Array(8).fill('object'),
            `All ${series.type} series points should have defined SVG graphic
            element after zoom reset`
        );
    });


    // Tests checking if swap angles are calculated correctly
    chart.update({
        pane: {
            startAngle: 0,
            endAngle: 180
        }
    });

    let initialXMin = chart.xAxis[0].getExtremes().min,
        initialXMax;

    controller.mouseDown(xPos + diameter / 4, yPos);
    controller.mouseMove(xPos - diameter / 2, yPos - 1);
    controller.mouseUp();

    let xMin = chart.xAxis[0].getExtremes().min;

    initialXMax = chart.xAxis[0].getExtremes().max;

    controller.mouseDown(xPos + diameter / 4, yPos);
    controller.mouseMove(xPos - diameter / 2, yPos + 1);
    controller.mouseUp();

    let xMax = chart.xAxis[0].getExtremes().max;

    assert.deepEqual(
        [xMin, xMax],
        [initialXMin, initialXMax],
        'Right semi circle (0deg, 180deg) should have correct swap angle'
    );

    chart.update({
        pane: {
            startAngle: 180,
            endAngle: 360
        }
    });

    initialXMin = chart.xAxis[0].getExtremes().min;

    controller.mouseDown(xPos - diameter / 4, yPos);
    controller.mouseMove(xPos + diameter / 2, yPos + 1);
    controller.mouseUp();

    xMin = chart.xAxis[0].getExtremes().min;

    initialXMax = chart.xAxis[0].getExtremes().max;

    controller.mouseDown(xPos - diameter / 4, yPos);
    controller.mouseMove(xPos + diameter / 2, yPos - 1);
    controller.mouseUp();

    xMax = chart.xAxis[0].getExtremes().max;

    assert.deepEqual(
        [initialXMin, initialXMax],
        [xMin, xMax],
        'Left semi circle (180deg, 360deg) should have correct swap angle'
    );

    chart.update({
        chart: {
            inverted: true
        },
        pane: {
            startAngle: 0,
            endAngle: 360
        },
        xAxis: {
            max: 7
        }
    });

    chart.xAxis[0].setExtremes();
    chart.yAxis[0].setExtremes();

    minX = 0;
    maxX = 5;
    minY = 4;
    maxY = 6;

    controller.mouseDown(xPos - diameter / 4, yPos);
    controller.mouseMove(xPos, yPos + diameter / 2);
    controller.mouseUp();

    [
        ['xAxis', 'min', minX],
        ['yAxis', 'min', minY],
        ['xAxis', 'max', maxX],
        ['yAxis', 'max', maxY]
    ].forEach(([axisName, extremeName, expected]) => {
        assert.close(
            chart[axisName][0].getExtremes()[extremeName],
            expected,
            0.1,
            `Zooming xy in inverted polar from (x1: ${maxX}, y1: ${minY})
            to (x2: ${minX}, y2: ${maxY}) should set correct ${axisName}
            ${extremeName}`
        );
    });

    let isSelection;

    chart.update({
        chart: {
            events: {
                selection: function () {
                    isSelection = Boolean(this.pointer.selectionMarker);
                }
            }
        },
        pane: {
            startAngle: -90,
            endAngle: 90
        }
    });

    controller.mouseDown(xPos - diameter / 4, yPos + 1);
    controller.mouseMove(xPos + diameter / 2, yPos + 1);
    controller.mouseUp();

    assert.ok(
        !isSelection,
        'Zoom shouldn\'t work outside top semi circle'
    );

    chart.update({
        pane: {
            startAngle: 90,
            endAngle: 270
        }
    });

    controller.mouseDown(xPos - diameter / 4, yPos - 1);
    controller.mouseMove(xPos + diameter / 2, yPos - 1);
    controller.mouseUp();

    assert.ok(
        !isSelection,
        'Zoom shouldn\'t work outside bottom semi circle'
    );
});