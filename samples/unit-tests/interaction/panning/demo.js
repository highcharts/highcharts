QUnit.test('#14426: Vertical panning after zooming', (assert) => {
    let chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            zoomType: 'xy',
            panKey: 'shift',
            panning: {
                enabled: true,
                type: 'xy'
            }
        },
        xAxis: {
            type: 'category'
        },
        series: [
            {
                data: [
                    {
                        name: 'A',
                        y: 1.2
                    },
                    {
                        name: 'B',
                        y: 4.02
                    },
                    {
                        name: 'C',
                        y: 1.92
                    }
                ]
            }
        ]
    });

    let controller = new TestController(chart);
    controller.pan([250, 50], [400, 300]);
    controller.pan([250, 300], [250, 50], { shiftKey: true });

    assert.strictEqual(
        chart.yAxis[0].min,
        0,
        'It should be possible to pan down to 0'
    );

    chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            zoomType: 'xy',
            panKey: 'shift',
            panning: {
                enabled: true,
                type: 'xy'
            }
        },
        xAxis: {
            type: 'category'
        },
        series: [
            {
                data: [
                    {
                        name: 'A',
                        y: -1.2
                    },
                    {
                        name: 'B',
                        y: -4.02
                    },
                    {
                        name: 'C',
                        y: -1.92
                    }
                ]
            }
        ]
    });

    controller = new TestController(chart);
    controller.pan([250, 50], [400, 300]);
    controller.pan([250, 50], [250, 300], { shiftKey: true });

    assert.strictEqual(
        chart.yAxis[0].max,
        0,
        'It should be possible to pan up to 0'
    );
});
