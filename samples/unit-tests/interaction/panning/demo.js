QUnit.test('#14426: Vertical panning after zooming', assert => {
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

QUnit.test('Mousewheel panning in x direction', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            zooming: {
                type: 'x'
            },
            panning: true,
            panKey: 'shift'
        },

        series: [{
            data: [
                23,
                10,
                50,
                100,
                4,
                10,
                23,
                10,
                50,
                100,
                4,
                10
            ]
        }]
    });

    const controller = new TestController(chart);
    controller.mouseWheel(200, 100, -10000);
    controller.mouseWheel(200, 100, { deltaY: 10000, shiftKey: true });

    console.log(chart.xAxis[0]);

    assert.close(
        chart.xAxis[0].min,
        -0.05,
        'It should be possible to wheel pan up to 0'
    );

    assert.close(
        chart.xAxis[0].max,
        4.95,
        'Wheel panning should keep the zoomed range.'
    );

});
