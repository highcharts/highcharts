QUnit.test('Draggable annotation - exporting', function (assert) {
    var firedEvents = {
            add: false,
            afterUpdate: false,
            drag: false,
            remove: false
        },
        chart = Highcharts.chart('container', {
            chart: {
                zoomType: 'xy'
            },
            plotOptions: {
                series: {
                    dragDrop: {
                        draggableY: true
                    }
                }
            },
            xAxis: {
                minRange: 0.1
            },
            yAxis: {
                minRange: 0.1
            },
            series: [
                {
                    data: [3, 6]
                }
            ],
            annotations: [
                {
                    id: 'first',
                    labels: [
                        {
                            point: {
                                xAxis: 0,
                                yAxis: 0,
                                x: 0.25,
                                y: 5
                            },
                            y: 0,
                            text: 'Annotation'
                        }
                    ],
                    events: {
                        add: () => {
                            firedEvents.add = true;
                        },
                        afterUpdate: () => {
                            firedEvents.afterUpdate = true;
                        },
                        drag: () => {
                            firedEvents.drag = true;
                        },
                        remove: () => {
                            firedEvents.remove = true;
                        }
                    }
                },
                {
                    shapes: [
                        {
                            point: {
                                xAxis: 0,
                                yAxis: 0,
                                x: 0.75,
                                y: 5
                            },
                            type: 'rect',
                            width: 30,
                            height: 30,
                            x: -15,
                            y: -15
                        }
                    ]
                }
            ]
        }),
        annoattionOptions = chart.options.annotations,
        oldExtremes = [
            chart.xAxis[0].getExtremes(),
            chart.yAxis[0].getExtremes()
        ],
        controller = new TestController(chart);

    // Label tests:
    controller.mouseDown(
        chart.xAxis[0].toPixels(0.25),
        chart.yAxis[0].toPixels(5)
    );
    controller.mouseMove(
        chart.xAxis[0].toPixels(0.25),
        chart.yAxis[0].toPixels(3)
    );
    controller.mouseUp();

    assert.close(
        annoattionOptions[0].labels[0].y,
        chart.yAxis[0].toPixels(3) - chart.yAxis[0].toPixels(5),
        1,
        'Correctly updated options for annotation\'s label (#10605).'
    );

    // Shape tests:
    controller.mouseDown(
        chart.xAxis[0].toPixels(0.75) - 5,
        chart.yAxis[0].toPixels(5)
    );
    controller.mouseMove(
        chart.xAxis[0].toPixels(0.75),
        chart.yAxis[0].toPixels(3)
    );
    controller.mouseUp();

    assert.close(
        annoattionOptions[1].shapes[0].point.y,
        3,
        0.5,
        'Correctly updated options for annotation\'s shape (#10605).'
    );

    [chart.xAxis[0], chart.yAxis[0]].forEach((axis, i) => {
        assert.strictEqual(
            axis.min,
            oldExtremes[i].min,
            axis.coll + '.min unchanged after drag&drop (#11801)'
        );
        assert.strictEqual(
            axis.max,
            oldExtremes[i].max,
            axis.coll + '.max unchanged after drag&drop (#11801)'
        );
    });

    chart.removeAnnotation('first');

    ['add', 'afterUpdate', 'drag', 'remove'].forEach(eventName => {
        assert.strictEqual(
            firedEvents[eventName],
            true,
            eventName + ' should be fired (#11970)'
        );
    });

    assert.strictEqual(
        chart.series[0].points[0].y,
        3,
        'Dragging an annotation should not drag point too (#12073)'
    );

    assert.strictEqual(
        chart.series[0].points[1].y,
        6,
        'Dragging an annotation should not drag point too (#12073)'
    );

    chart = Highcharts.chart('container', {
        series: [
            {
                keys: ['y', 'id'],
                data: [
                    [29.9, '0'],
                    [71.5, '1'],
                    [106.4, '2'],
                    [129.2, '3'],
                    [144.0, '4'],
                    [176.0, '5']
                ]
            }
        ],
        tooltip: {
            enabled: false
        },
        annotations: [
            {
                labels: [
                    {
                        point: '2',
                        text: '<span class="html-annotation">HTML Text</span>',
                        useHTML: true
                    }
                ],
                draggable: 'xy'
            },
            {
                labels: [
                    {
                        point: '4',
                        text: 'Normal Text'
                    }
                ],
                draggable: 'xy'
            }
        ]
    });

    var labelGraphic = chart.annotations[0].labels[0].graphic,
        offset = 5;

    controller = new TestController(chart);
    controller.mouseDown(labelGraphic.x + offset, labelGraphic.y + offset);
    controller.mouseMove(
        chart.xAxis[0].toPixels(0.5),
        chart.yAxis[0].toPixels(170)
    );
    controller.mouseUp();

    assert.close(
        labelGraphic.x,
        chart.xAxis[0].toPixels(0.5) - offset,
        0.5,
        'An annotation with HTML label should be X draggable (#13070).'
    );

    assert.close(
        labelGraphic.y,
        chart.yAxis[0].toPixels(170) - offset,
        0.5,
        'An annotation with HTML label should be Y draggable (#13070).'
    );
});
