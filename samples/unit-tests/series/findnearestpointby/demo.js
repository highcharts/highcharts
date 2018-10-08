
QUnit.test('findNearestPointBy test', function (assert) {
    var chart = Highcharts.chart('container', {

        chart: {
            width: 600
        },

        title: {
            text: 'The top series snaps hover along X axis'
        },

        plotOptions: {
            line: {
                kdNow: true,
                marker: {
                    enabled: true
                }
            }
        },

        series: [{
            findNearestPointBy: 'x',
            // Hover at [3.5, 6] to demo x-dimension search
            // Compare to Series 2 behavior at [5.5, 3]
            data: [
                [0, 6],
                [1, 6],
                [1, 7],
                [2, 6],
                [3, 6],
                [3.5, 4],
                [4, 6],
                [5, 6],
                [6, 6]
            ]
        }, {
            findNearestPointBy: 'xy',
            // Hover at [1, 4] to demo xy-dimension search.
            // Useful when having multiple points on the same x-value.
            data: [
                [0, 3],
                [1, 3],
                [1, 4],
                [2, 3],
                [3, 3],
                [4, 3],
                [5, 3],
                [5.5, 5.5],
                [6, 3]
            ]
        }]
    });

    var controller = window.TestController(chart),
        x1 = chart.series[0].points[5].plotX + chart.plotLeft,
        y1 = chart.series[0].points[1].plotY + chart.plotTop,
        x2 = chart.series[1].points[7].plotX + chart.plotLeft,
        y2 = chart.series[1].points[1].plotY + chart.plotTop,
        x3 = chart.series[0].points[2].plotX + chart.plotLeft,
        y3 = chart.series[0].points[2].plotY + chart.plotTop,
        x4 = chart.series[0].points[1].plotX + chart.plotLeft,
        y4 = chart.series[0].points[1].plotY + chart.plotTop,
        x5 = chart.series[1].points[2].plotX + chart.plotLeft,
        y5 = chart.series[1].points[2].plotY + chart.plotTop,
        x6 = chart.series[1].points[1].plotX + chart.plotLeft,
        y6 = chart.series[1].points[1].plotY + chart.plotTop;

    controller.mouseMove(x1, y1);
    assert.ok(
        chart.hoverPoint === chart.series[0].points[5],
        'Hover point snaps to X'
    );

    controller.mouseMove(x2, y2);
    assert.notOk(
        chart.hoverPoint === chart.series[1].points[7],
        'Hover point does not snap to X'
    );

    controller.mouseMove(x3, y3);
    if (chart.hoverPoint === chart.series[0].points[2]) {
        controller.mouseMove(x4, y4);
        assert.notOk(
            chart.hoverPoint === chart.series[0].points[1],
            'Hover does not allow duplicate X'
        );
    }

    controller.mouseMove(x5, y5);
    assert.ok(
        chart.hoverPoint === chart.series[1].points[2],
        'Hover allows duplicate X'
    );

    controller.mouseMove(x6, y6);
    assert.ok(
        chart.hoverPoint === chart.series[1].points[1],
        'Hover allows duplicate X'
    );
});

