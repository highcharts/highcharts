QUnit.test('Panning when yAxis min/max are set (#24029)', function (assert) {
    // Generate test data
    const data = [];
    for (let i = 0; i < 500000; i++) {
        data.push([i, Math.sin(i / 10) * 10 + 10]);
    }

    const chart = Highcharts.chart('container', {
        chart: {
            zooming: {
                type: 'xy'
            },
            panning: {
                enabled: true,
                type: 'xy'
            },
            panKey: 'shift'
        },
        boost: {
            useGPUTranslations: true
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            min: -5,
            max: 25
        },
        series: [{
            data: data,
            lineWidth: 0.5
        }]
    });

    // // 1. Zoom to a specific part of the chart
    const controller = new TestController(chart);

    // Zoom in
    controller.mouseDown(
        200,
        150
    );
    controller.mouseMove(
        210,
        160
    );
    controller.mouseUp();

    const yAxisZoomExtremes = chart.yAxis[0].getExtremes();
    const xAxisZoomExtremes = chart.xAxis[0].getExtremes();

    // Pan
    controller.mouseDown(
        200,
        150, { shiftKey: true }
    );
    controller.mouseMove(
        210,
        160, { shiftKey: true }
    );
    controller.mouseUp();

    // yAxis extremes should have changed after yAxis panning
    assert.ok(
        chart.yAxis[0].min !== yAxisZoomExtremes.min ||
        chart.yAxis[0].max !== yAxisZoomExtremes.max,
        'yAxis extremes should change after yAxis panning'
    );

    // xAxis extremes should have changed after xAxis panning
    console.log(chart.xAxis[0].min, xAxisZoomExtremes.min);
    assert.ok(
        chart.xAxis[0].min !== xAxisZoomExtremes.min ||
        chart.xAxis[0].max !== xAxisZoomExtremes.max,
        'xAxis extremes should change after xAxis panning'
    );
});
