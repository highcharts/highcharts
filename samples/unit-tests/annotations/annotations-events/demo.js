QUnit.test('Annotations events - general', function (assert) {
    var addEventCalled = 0,
        afterUpdateEventCalled = 0,
        removeEventCalled = 0,
        popupOptions,
        getShapes = function () {
            return [{
                strokeWidth: 3,
                type: 'path',
                points: [{
                    x: 2,
                    y: 10,
                    xAxis: 0,
                    yAxis: 0
                }, {
                    x: 2,
                    y: 15,
                    xAxis: 0,
                    yAxis: 0
                }]
            }];
        },
        chart = Highcharts.chart('container', {
            annotations: [{
                shapes: getShapes(),
                draggable: true,
                events: {
                    add: function () {
                        addEventCalled++;
                    },
                    afterUpdate: function () {
                        afterUpdateEventCalled++;
                    },
                    remove: function () {
                        removeEventCalled++;
                    }
                }
            }, {
                shapes: [{
                    type: 'circle',
                    point: {
                        xAxis: 0,
                        yAxis: 0,
                        x: 5,
                        y: 20
                    },
                    r: 10
                }]
            }],
            navigation: {
                events: {
                    showPopup: function (event) {
                        popupOptions = event.options;
                    }
                }
            },
            series: [{
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 23.3, 18.3, 13.9, 9.6]
            }]
        }),
        annotation = chart.annotations[0],
        point = chart.series[0].points[2],
        controller = new TestController(chart);

    assert.strictEqual(
        addEventCalled,
        1,
        'annotations.events.add called just once.'
    );

    annotation.update({
        shapes: [{
            strokeWidth: 15
        }]
    });
    assert.strictEqual(
        afterUpdateEventCalled,
        1,
        'annotations.events.afterUpdate called just once - after' +
            '`annotation.update()`.'
    );

    var mouseDown = false,
        unbindMouseDownEvent = Highcharts.addEvent(
            document.getElementById('container'),
            'mousedown',
            function () {
                mouseDown = true;
            }
        );

    controller.mouseDown(
        chart.plotLeft + point.plotX,
        chart.plotTop + point.plotY - 20
    );

    assert.strictEqual(
        mouseDown,
        true,
        'Default mouseDown event called (#10961).'
    );

    unbindMouseDownEvent();

    controller.mouseMove(
        chart.plotLeft + point.plotX + 50,
        chart.plotTop + point.plotY - 20
    );
    controller.mouseUp();

    assert.strictEqual(
        afterUpdateEventCalled,
        2,
        'annotations.events.afterUpdate called just once - after drag&drop'
    );

    controller.click(
        chart.plotLeft + point.plotX + 50,
        chart.plotTop + point.plotY - 20
    );

    chart.removeAnnotation(annotation);

    assert.strictEqual(
        removeEventCalled,
        1,
        'annotations.events.remove called just once.'
    );

    chart.addAnnotation({ shapes: getShapes() });

    controller.click(
        chart.plotLeft + point.plotX,
        chart.plotTop + point.plotY - 20
    );

    assert.ok(
        true,
        'No errors after removing selected annotation and selecting a new one (#11015)'
    );

    controller.click(
        chart.xAxis[0].toPixels(5),
        chart.yAxis[0].toPixels(20)
    );

    assert.deepEqual(
        popupOptions,
        {
            langKey: undefined,
            shapes: [{
                fill: ['rgba(0, 0, 0, 0.75)', 'text'],
                stroke: ['rgba(0, 0, 0, 0.75)', 'text'],
                strokeWidth: [1, 'number']
            }],
            type: 'circle'
        },
        'Annotations\' popup should get correct config for fields (#11716)'
    );
});