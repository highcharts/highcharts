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