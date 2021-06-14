QUnit.test('Axis pointPlacement', assert => {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            zoomType: 'x',
            panning: true,
            panKey: 'shift'
        },
        xAxis: {
            categories: ['Apples', 'Pears', 'Bananas', 'Oranges']
        },
        series: [
            {
                data: [
                    [1541688900000, 1],
                    [1541689200000, 1],
                    [1541692800000, 4],
                    [1541696400000, 1],
                    [1541898000000, 1],
                    [1542009600000, 1],
                    [1542013200000, 1],
                    [1542016800000, 1],
                    [1542020400000, 1],
                    [1542038400000, 1]
                ],
                type: 'column',
                pointPlacement: 'on'
            }
        ]
    });

    const axis = chart.xAxis[0];
    const controller = new TestController(chart);

    assert.strictEqual(axis.toPixels(1541688900000, true), 0, 'No padded ticks');

    assert.strictEqual(
        axis.toPixels(1542038400000, true),
        chart.plotWidth,
        'No padded ticks'
    );

    controller.pan([200, 60], [400, 60]);

    const rangeBefore = axis.max - axis.min;
    controller.pan([200, 60], [400, 60], { shiftKey: true });
    assert.close(
        rangeBefore,
        axis.max - axis.min,
        1,
        '#9612: Axis range should not change when panning'
    );

    chart = Highcharts.chart('container', {
        chart: {
            inverted: true
        },
        series: [
            {
                data: [1, 4, 3, 5],
                type: 'column',
                pointPlacement: 'between',
                pointPadding: 0,
                groupPadding: 0
            }
        ]
    });

    var isInsidePlot = true;

    chart.series[0].points.forEach(p => {
        if (isInsidePlot) {
            isInsidePlot = chart.isInsidePlot(
                p.plotX,
                p.plotY,
                { inverted: true }
            );
        }
    });

    assert.ok(
        isInsidePlot,
        'All points are between appropriate ticks when the chart is inverted.'
    );
});

QUnit.test('#14637: Line series pointPlacement="between"', assert => {
    const chart = Highcharts.chart('container', {
        plotOptions: {
            series: {
                pointPlacement: 'between'
            }
        },
        series: [
            {
                type: 'column',
                data: [5, 3, 4, 7, 2]
            },
            {
                type: 'line',
                data: [3, 5, 6, 2, 9]
            }
        ]
    });

    assert.strictEqual(
        Math.floor(chart.series[1].points[0].plotX),
        Math.floor(chart.xAxis[0].toPixels(0.5, true)),
        'Points should be placed between ticks'
    );
});
