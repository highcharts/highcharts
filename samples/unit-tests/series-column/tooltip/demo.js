QUnit.test(
    'Shared tooltip should compare point.distX, not point.dist to find absolute closest point (#4645)',
    function (assert) {
        var chart = $('#container')
                .highcharts({
                    chart: {
                        type: 'column',
                        animation: false
                    },
                    tooltip: {
                        shared: true
                    },
                    series: [
                        {
                            data: [5, 5, 5, 5, 5, 5]
                        },
                        {
                            data: [5, 5, 5]
                        },
                        {
                            data: [
                                [3, 1],
                                [4, 1],
                                [5, 1]
                            ]
                        }
                    ],

                    plotOptions: {
                        series: {
                            animation: false
                        }
                    }
                })
                .highcharts(),
            series = chart.series[1],
            point = series.points[2];

        var controller = new TestController(chart);

        controller.mouseMove(chart.plotLeft + point.plotX, chart.plotTop + 5);

        controller.mouseMove(
            chart.plotLeft + point.plotX,
            chart.plotTop + chart.plotHeight - 15
        );
        /* chart.pointer.onContainerMouseMove({
        pageX: x,
        pageY: y, // from the top
        target: point.graphic.element
    });

    chart.pointer.onContainerMouseMove({
        pageX: x,
        pageY: y + chart.plotHeight - 15, // to the bottom
        target: point.graphic.element
    });*/

        assert.strictEqual(
            chart.hoverPoints.indexOf(point) >= 0,
            true,
            'Proper hovered point.'
        );
    }
);

QUnit.test(
    'Tooltip should stay inside plotArea even when columns are outside axis extremes.',
    function (assert) {
        var chart = new Highcharts.Chart('container', {
            chart: {
                type: 'column',
                marginTop: 150
            },
            plotOptions: {
                series: {
                    stacking: true
                }
            },
            tooltip: {
                outside: true
            },
            series: [
                {
                    data: [100]
                },
                {
                    data: [-100]
                }
            ],
            yAxis: [
                {
                    min: -20,
                    max: 20,
                    startOnTick: false,
                    endOnTick: false
                }
            ]
        });

        var point = chart.series[0].data[0],
            controller = new TestController(chart);

        controller.mouseOver(chart.plotLeft + point.plotX + 4, chart.plotTop);

        assert.strictEqual(
            point.tooltipPos[1] >= 0,
            true,
            'Tooltip should be inside plotArea (#14138).'
        );
    }
);
