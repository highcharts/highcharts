QUnit.test('Do not change hoverChartIndex during a drag (#4906)', function (assert) {
    var chart1,
        chart2,
        offset1,
        offset2,
        y,
        start,
        end;

    document.getElementById('container').style.maxWidth = '1210px';
    document.getElementById('container').style.width = '1210px';
    const container1 = document.createElement('div');
    document.getElementById('container').appendChild(container1);
    container1.style.width = '600px';
    container1.style.cssFloat = 'left';
    const container2 = document.createElement('div');
    document.getElementById('container').appendChild(container2);
    container2.style.width = '600px';
    container2.style.cssFloat = 'left';


    chart1 = Highcharts.chart(container1, {
        chart: {
            zoomType: 'x'
        },
        series: [{
            data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
        }],
        title: {
            text: 'Chart1'
        }
    });
    chart2 = Highcharts.chart(container2, {
        chart: {
            zoomType: 'x'
        },
        series: [{
            data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
        }],
        title: {
            text: 'Chart2'
        }
    });

    Highcharts.each(chart1.axes, function (axis) {
        if (axis.isXAxis) {
            assert.strictEqual(
                typeof axis.userMin,
                'undefined',
                'Chart1 has not zoomed'
            );
        }
    });
    Highcharts.each(chart2.axes, function (axis) {
        if (axis.isXAxis) {
            assert.strictEqual(
                typeof axis.userMin,
                'undefined',
                'Chart2 has not zoomed'
            );
        }
    });

    offset1 = Highcharts.offset(chart1.container);
    offset2 = Highcharts.offset(chart2.container);
    start = offset1.left + chart1.plotLeft + (chart1.plotSizeX / 2);
    end = offset2.left + chart2.plotLeft + (chart2.plotSizeX / 2);
    y = offset1.top + chart1.plotTop + (chart1.plotSizeY / 2);
    // Do a drag and drop
    chart1.pointer.onContainerMouseDown({
        type: 'mousedown',
        pageX: start,
        pageY: y
    });
    chart1.pointer.onContainerMouseMove({
        type: 'mousemove',
        pageX: end,
        pageY: y
    });
    chart1.pointer.onDocumentMouseUp({
        type: 'mouseup',
        pageX: end,
        pageY: y
    });

    // Test after interaction
    Highcharts.each(chart1.axes, function (axis) {
        if (axis.isXAxis) {
            assert.strictEqual(
                typeof axis.userMin,
                'number',
                'Chart1 has zoomed'
            );
        }
    });
    Highcharts.each(chart2.axes, function (axis) {
        if (axis.isXAxis) {
            assert.strictEqual(
                typeof axis.userMin,
                'undefined',
                'Chart2 has still not zoomed'
            );
        }
    });

    chart1.destroy();
    chart2.destroy();
    container1.parentNode.removeChild(container1);
    container2.parentNode.removeChild(container2);
});
QUnit.test('Dragdrop enabled in dynamic chart', function (assert) {

    var chart = Highcharts.chart('container', {
            series: []
        }),
        assertNoEvents = function () {
            assert.notOk(chart.unbindDragDropMouseUp, 'No mouse up event');
            assert.notOk(chart.hasAddedDragDropEvents, 'No events added flag');
        };

    assertNoEvents();

    chart.addSeries({
        data: [1, 2, 3]
    });

    assertNoEvents();

    chart.series[0].remove();

    assertNoEvents();

    chart.addSeries({
        data: [4, 5, 6]
    });

    assertNoEvents();

    chart.addSeries({
        data: [7, 8, 9],
        dragDrop: {
            draggableY: true
        }
    });

    assert.ok(chart.unbindDragDropMouseUp, 'Has mouse up event');
    assert.ok(chart.hasAddedDragDropEvents, 'Has events added flag');
});

QUnit.test('Dragdrop and logarithmic axes', function (assert) {
    var chart = Highcharts.chart('container', {
            xAxis: {
                type: 'logarithmic',
                min: 1
            },

            yAxis: {
                type: 'logarithmic'
            },

            series: [{
                type: 'scatter',
                data: [
                    [1.5, 70], // drag this point
                    [2, 45],
                    [3.5, 20],
                    [5, 15],
                    [7.5, 8],
                    [16, 3]
                ]
            }],

            plotOptions: {
                series: {
                    dragDrop: {
                        draggableY: true,
                        draggableX: true
                    }
                }
            }
        }),
        controller = new TestController(chart),
        xAxis = chart.xAxis[0],
        yAxis = chart.yAxis[0],
        point = chart.series[0].points[0],
        x = point.plotX + chart.plotLeft,
        y = point.plotY + chart.plotTop,
        pxTranslationX = xAxis.len / 2,
        pxTranslationY = yAxis.len / 2;

    // Hover draggable point, so k-d tree builds and
    // `chart.hoverPoint` will be available for drag&drop module:
    controller.mouseMove(x, y);

    // Drag point:
    controller.mouseDown(x, y);

    // Move point:
    controller.mouseMove(x + pxTranslationX, y + pxTranslationY);

    // And mic drop:
    controller.mouseUp(x + pxTranslationX, y + pxTranslationY);

    assert.close(
        point.x,
        xAxis.toValue(x + pxTranslationX),
        0.1,
        'Correct x-value after horizontal drag&drop (#10285)'
    );

    assert.close(
        point.y,
        yAxis.toValue(y + pxTranslationY),
        0.1,
        'Correct y-value after vertical drag&drop (#10285)'
    );
});

QUnit.test('Dragdrop with boost', function (assert) {
    var chart = Highcharts.chart('container', {
            boost: {
                seriesThreshold: 1
            },
            series: [{
                data: [
                    [0, 4, 'line1'],
                    [10, 7, 'line1'],
                    [10.001, 3, 'line1'],
                    [10.002, 5, 'line1'],
                    [20, 10, 'line1']
                ],
                keys: ['x', 'y', 'groupId'],
                dragDrop: {
                    liveRedraw: false,
                    draggableX: true,
                    draggableY: true,
                    groupBy: 'groupId'
                }
            }]
        }),
        controller = new TestController(chart),
        point = chart.series[0].points[0],
        x = point.plotX + chart.plotLeft,
        y = point.plotY + chart.plotTop;

    controller.mouseMove(x, y);
    controller.mouseDown(x, y);
    controller.mouseMove(x + 100, y + 100);
    controller.mouseUp(x + 100, y + 100);

    assert.notEqual(
        point.x,
        chart.series[0].points[0].x,
        'Dragdrop should work with boost (#11156).'
    );
});
