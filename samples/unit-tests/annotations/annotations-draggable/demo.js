QUnit.test('Draggable annotation - exporting', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                data: [3, 6]
            }],
            annotations: [{
                labels: [{
                    point: {
                        xAxis: 0,
                        yAxis: 0,
                        x: 0.25,
                        y: 5
                    },
                    y: 0,
                    text: 'Annotation'
                }]
            }, {
                shapes: [{
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
                }]
            }]
        }),
        annoattionOptions = chart.options.annotations,
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
        chart.xAxis[0].toPixels(0.75) - 5,
        chart.yAxis[0].toPixels(3)
    );
    controller.mouseUp();

    assert.close(
        annoattionOptions[1].shapes[0].point.y,
        3,
        0.5,
        'Correctly updated options for annotation\'s shape (#10605).'
    );
});
