QUnit.test(
    'Do not change hoverChartIndex during a drag (#4906)',
    function (assert) {
        var chart1, chart2, offset1, offset2, y, start, end;

        var mainContainer = document.getElementById('container');
        var initialMaxWidth = mainContainer.style.maxWidth;
        var initialWidth = mainContainer.style.width;
        mainContainer.style.maxWidth = '1210px';
        mainContainer.style.width = '1210px';
        var container1 = document.createElement('div');
        mainContainer.appendChild(container1);
        container1.style.width = '600px';
        container1.style.cssFloat = 'left';
        var container2 = document.createElement('div');
        mainContainer.appendChild(container2);
        container2.style.width = '600px';
        container2.style.cssFloat = 'left';

        chart1 = Highcharts.chart(container1, {
            chart: {
                zoomType: 'x'
            },
            series: [
                {
                    data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
                }
            ],
            title: {
                text: 'Chart1'
            }
        });
        chart2 = Highcharts.chart(container2, {
            chart: {
                zoomType: 'x'
            },
            series: [
                {
                    data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
                }
            ],
            title: {
                text: 'Chart2'
            }
        });

        chart1.axes.forEach(axis => {
            if (axis.isXAxis) {
                assert.strictEqual(
                    typeof axis.userMin,
                    'undefined',
                    'Chart1 has not zoomed'
                );
            }
        });
        chart2.axes.forEach(axis => {
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
        start = offset1.left + chart1.plotLeft + chart1.plotSizeX / 2;
        end = offset2.left + chart2.plotLeft + chart2.plotSizeX / 2;
        y = offset1.top + chart1.plotTop + chart1.plotSizeY / 2;
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
        chart1.axes.forEach(axis => {
            if (axis.isXAxis) {
                assert.strictEqual(
                    typeof axis.userMin,
                    'number',
                    'Chart1 has zoomed'
                );
            }
        });
        chart2.axes.forEach(axis => {
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
        container1.remove();
        container2.remove();
        mainContainer.style.width = initialWidth;
        mainContainer.style.maxWidth = initialMaxWidth;
    }
);

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
        type: 'column',
        data: [7, 8, 9],
        dragDrop: {
            draggableY: true,
            dragHandle: {
                cursor: 'grab'
            }
        }
    });

    assert.ok(chart.unbindDragDropMouseUp, 'Has mouse up event');
    assert.ok(chart.hasAddedDragDropEvents, 'Has events added flag');

    chart.yAxis[0].update({
        reversed: true
    });

    let point = chart.series[1].points[0];
    point.showDragHandles();

    assert.strictEqual(
        document.querySelector('.highcharts-drag-handle').attributes.cursor.value,
        'grab',
        '#16470: DragHandle cursor should use general options.'
    );

    assert.ok(
        Math.abs(chart.dragHandles.undefined.translateY - point.plotY) <= 1,
        '#9549: Handle should be below the point when yAxis is reversed'
    );

    chart.series[1].remove();
    chart.series[0].update({
        dragDrop: {
            draggableY: true
        }
    });

    point = chart.series[0].points[2];

    const controller = new TestController(chart);
    const x = chart.plotLeft + point.plotX;
    const y = chart.plotTop + point.plotY;

    controller.mouseMove(x, y);
    controller.mouseDown(x, y);
    controller.mouseMove(x, y + 20);

    chart.series[0].update({
        data: [4, 5]
    });

    controller.mouseMove();
    controller.mouseUp();

    assert.ok(true, '#15537: Destroying point while dragging should not throw');

    // Clear chart.dragHandles for the next test
    chart.hideDragHandles();

    chart.series[0].update({
        type: 'column',
        data: [1, 2, 3, 5],
        pointPadding: 0,
        groupPadding: 0
    }, false);

    chart.xAxis[0].update({
        type: 'category'
    });

    chart.series[0].points[0].showDragHandles();

    assert.ok(
        // dragHandles.undefined element is created in the showDragHandles
        // method after the changes made in #16596 after the function's return.
        // The return should be skipped and the dragHandles.undefined element
        // should be created.
        chart.dragHandles && chart.dragHandles.undefined,
        `DragHandles should be visible - dragging should work on the first
        column in a categorized xAxis, (#16596)`
    );
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

            series: [
                {
                    type: 'scatter',
                    data: [
                        [1.5, 70], // drag this point
                        [2, 45],
                        [3.5, 20],
                        [5, 15],
                        [7.5, 8],
                        [16, 3]
                    ]
                }
            ],

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
            series: [
                {
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
                }
            ]
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

QUnit.test('Dragdrop with stacked columns (#18741)', function (assert) {
    const chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    dragDrop: {
                        draggableY: true,
                        liveRedraw: false
                    }
                }
            },
            series: [{
                data: [2, -3]
            }, {
                data: [4, -4]
            }]
        }),
        controller = new TestController(chart);

    let point = chart.series[0].points[0],
        x = chart.plotLeft + point.plotX,
        y = chart.plotTop + point.plotY;

    point.showDragHandles();
    controller.mouseDown(x, y);
    controller.mouseMove(x, y - 20);

    assert.close(
        chart.dragGuideBox.attr('y'),
        point.shapeArgs.y - 20,
        2,
        'GuideBox should be positioned correcly in Y, positive value.'
    );

    assert.close(
        chart.dragGuideBox.attr('height'),
        point.shapeArgs.height + 20,
        2,
        'GuideBox should be the correct height, positive value.'
    );

    controller.mouseUp();

    point = chart.series[0].points[1];
    x = chart.plotLeft + point.plotX;
    y = chart.plotTop + point.plotY;

    point.showDragHandles();
    controller.mouseDown(x, y);
    controller.mouseMove(x, y + 20);

    assert.close(
        chart.dragGuideBox.attr('y'),
        point.shapeArgs.y,
        2,
        'GuideBox should be positioned correcly in Y, negative value.'
    );

    assert.close(
        chart.dragGuideBox.attr('height'),
        point.shapeArgs.height + 20,
        2,
        'GuideBox should be the correct height, negative value.'
    );

    controller.mouseUp();

    chart.update({
        yAxis: {
            reversed: true
        },
        series: [{
            data: [2, -3]
        }, {
            data: [4, -4]
        }]
    });

    point = chart.series[0].points[0];
    x = chart.plotLeft + point.plotX;
    y = chart.plotTop + point.plotY;

    point.showDragHandles();
    controller.mouseDown(x, y);
    controller.mouseMove(x, y + 20);

    assert.close(
        chart.dragGuideBox.attr('y'),
        point.shapeArgs.y,
        2,
        'GuideBox should be positioned correcly in Y, positive value, reversed.'
    );

    assert.close(
        chart.dragGuideBox.attr('height'),
        point.shapeArgs.height + 20,
        2,
        'GuideBox should be the correct height, positive value, reversed.'
    );

    controller.mouseUp();

    point = chart.series[0].points[1];
    x = chart.plotLeft + point.plotX;
    y = chart.plotTop + point.plotY;

    point.showDragHandles();
    controller.mouseDown(x, y);
    controller.mouseMove(x, y - 20);

    assert.close(
        chart.dragGuideBox.attr('y'),
        point.shapeArgs.y - 20,
        2,
        'GuideBox should be positioned correcly in Y, negative value, reversed.'
    );

    assert.close(
        chart.dragGuideBox.attr('height'),
        point.shapeArgs.height + 20,
        2,
        'GuideBox should be the correct height, negative value, reversed.'
    );
});
