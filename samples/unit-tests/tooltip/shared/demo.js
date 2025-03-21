(function () {
    function generateData(n, k) {
        var data = [];
        while (n--) {
            data.push(Math.random() + k);
        }
        return data;
    }

    QUnit.test(
        'Shared tooltip should always highlight all markers. (#5766)',
        function (assert) {
            var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'container'
                    },
                    tooltip: {
                        shared: true
                    },
                    series: [
                        {
                            data: generateData(500, 0)
                        },
                        {
                            data: generateData(500, 10)
                        }
                    ]
                }),
                offset = $('#container').offset(),
                left = offset.left + chart.plotLeft,
                top = offset.top + chart.plotTop,
                points = chart.series[0].points;

            chart.pointer.onContainerMouseMove({
                type: 'mousemove',
                pageX: left + points[10].plotX,
                pageY: top + points[10].plotY,
                target: points[10].series.group.element
            });
            chart.pointer.onContainerMouseMove({
                type: 'mousemove',
                pageX: left + points[15].plotX,
                pageY: top + points[15].plotY,
                target: points[15].series.group.element
            });

            // I know, checking path is a bit risky, but at this moment, there's
            // no visibility on the halo, only path change
            assert.strictEqual(
                chart.series[0].halo.d !== 'M 0 0',
                true,
                'First series: halo visible.'
            );
            assert.strictEqual(
                chart.series[1].halo.d !== 'M 0 0',
                true,
                'Second series: halo visible.'
            );
        }
    );
}());

QUnit.test(
    'Shared tooltip should always highlight all markers. (#5862)',
    function (assert) {
        var hoverColor = 'red',
            chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'container'
                },
                tooltip: {
                    shared: true
                },
                series: [
                    {
                        type: 'column',
                        data: [1, 2, 3, 4, 5],
                        states: {
                            hover: {
                                color: hoverColor
                            }
                        }
                    }
                ]
            }),
            offset = $('#container').offset(),
            left = offset.left + chart.plotLeft,
            top = offset.top + chart.plotTop,
            points = chart.series[0].points;

        chart.pointer.onContainerMouseMove({
            type: 'mousemove',
            pageX: left + points[0].plotX,
            pageY: top
        });
        chart.pointer.onContainerMouseMove({
            type: 'mousemove',
            pageX: left + points[1].plotX,
            pageY: top
        });
        chart.pointer.onContainerMouseMove({
            type: 'mousemove',
            pageX: left + points[0].plotX,
            pageY: top
        });

        assert.strictEqual(
            points[0].graphic.attr('fill'),
            hoverColor,
            'First point hovered'
        );
    }
);

QUnit.test(
    'Click event was called for a wrong series (#5622)', assert => {
        var $container = $('#container'),
            chart = $container
                .highcharts({
                    yAxis: [
                        {
                            opposite: true
                        },
                        {
                            opposite: true
                        },
                        {
                            opposite: true
                        }
                    ],
                    tooltip: {
                        shared: true
                    },
                    series: [
                        {
                            type: 'column',
                            yAxis: 1,
                            data: [
                                49.9,
                                71.5,
                                106.4,
                                129.2,
                                144.0,
                                176.0,
                                135.6,
                                148.5,
                                216.4,
                                194.1,
                                95.6,
                                54.4
                            ],
                            zIndex: 1
                        },
                        {
                            yAxis: 2,
                            data: [
                                1016,
                                1016,
                                1015.9,
                                1015.5,
                                1012.3,
                                1009.5,
                                1009.6,
                                1010.2,
                                1013.1,
                                1016.9,
                                1018.2,
                                1016.7
                            ],
                            zIndex: 2
                        },
                        {
                            type: 'spline',
                            data: [
                                7.0,
                                6.9,
                                9.5,
                                14.5,
                                18.2,
                                21.5,
                                25.2,
                                26.5,
                                23.3,
                                18.3,
                                13.9,
                                9.6
                            ],
                            zIndex: 1000,
                            lineWidth: 10
                        }
                    ]
                })
                .highcharts(),
            offset = $container.offset(),
            left = offset.left + chart.plotLeft,
            top = offset.top + chart.plotTop,
            point = chart.series[2].points[2];

        chart.pointer.onContainerMouseMove({
            type: 'mousemove',
            pageX: left + point.plotX,
            pageY: top + point.plotY,
            target: point.series.group.element
        });

        assert.strictEqual(
            chart.hoverPoint && chart.hoverPoint.series.type,
            chart.series[2].type,
            'Correct point hovered.'
        );
    }
);

QUnit.test('Shared tooltip with pointPlacement and stickOnContact', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },

        tooltip: {
            shared: true,
            stickOnContact: true
        },
        plotOptions: {
            series: {
                stacking: 'normal',
                kdNow: true
            }
        },

        series: [
            {
                data: [1, 1, 1],
                stack: 'a',
                pointPlacement: 0.06
            },
            {
                data: [2, 2, 2],
                stack: 'test'
            },
            {
                data: [3, 3, 3],
                stack: 'test'
            },
            {
                data: [4, 4, 4],
                stack: 'other',
                pointPlacement: -0.06
            },
            {
                data: [5, 5, 5],
                stack: 'other',
                pointPlacement: -0.06
            }
        ]
    });

    const offset = Highcharts.offset(chart.container),
        point = chart.series[0].points[0];

    // Set hoverPoint
    point.onMouseOver();

    chart.pointer.onContainerMouseMove({
        type: 'mousemove',
        pageX: point.plotX + chart.plotLeft + offset.left,
        pageY: point.plotY + chart.plotTop + offset.top,
        target: chart.container
    });

    assert.strictEqual(
        chart.hoverPoints.length, 5, '#5832: All series ' +
        'present'
    );

    const heightBefore = chart.tooltip.tracker.attr('height');
    chart.series[1].points[0].onMouseOver();
    assert.strictEqual(
        chart.tooltip.tracker.attr('height'),
        heightBefore,
        '#15843: Tracker height should be the same after hovering another ' +
        'point in the same stack'
    );

    // remove all series
    while (chart.series.length) {
        chart.series[0].remove(false);
    }

    chart.addSeries({
        data: [4, 4]
    }, false);
    chart.addSeries({
        data: [5, 15]
    }, false);
    chart.update({
        chart: {
            type: 'bar'
        },
        yAxis: {
            reversedStacks: false
        }
    });

    chart.series[0].points[0].onMouseOver();

    const predictedTooltipX = chart.series[1].points[0].tooltipPos[0] +
        chart.plotLeft + chart.tooltip.distance;

    assert.close(
        predictedTooltipX,
        chart.tooltip.getLabel().x,
        1,
        `#17948: Tooltip should be displayed at the end of the bar,
            when reversedStacks is set to false.`
    );
});

QUnit.test('Shared tooltip with multiple axes', assert => {
    const chart = Highcharts.chart('container', {
        series: [{
            data: [4]
        }, {
            data: [2, 6, 4],
            type: 'column'
        }, {
            data: [4, 7, 9, 1],
            type: 'column',
            yAxis: 1
        }],
        tooltip: {
            shared: true,
            hideDelay: 0
        },
        yAxis: [{
            height: '50%'
        }, {
            top: '60%',
            height: '40%',
            offset: 0
        }]
    });

    const controller = new TestController(chart);
    let point = chart.series[2].points[0];
    const axis = chart.yAxis[1];

    controller.moveTo(axis.left + point.plotX, axis.top + point.plotY + 5);
    assert.notOk(
        chart.tooltip.isHidden,
        '#16004: Tooltip should be visible'
    );

    // Move to a single point
    point = chart.series[2].points[3];
    controller.moveTo(axis.left + point.plotX, axis.top + point.plotY + 5);

    assert.ok(
        !!chart.tooltip.label.anchorX,
        'Tooltip should have anchorX for a single point'
    );
    assert.ok(
        !!chart.tooltip.label.anchorY,
        'Tooltip should have anchorY for a single point'
    );

    // Move from a single point to multiple points
    point = chart.series[2].points[2];
    controller.moveTo(axis.left + point.plotX, axis.top + point.plotY + 5);

    assert.ok(
        !chart.tooltip.label.anchorX,
        'Tooltip should NOT have anchorX for multiple points'
    );
    assert.ok(
        !chart.tooltip.label.anchorY,
        'Tooltip should NOT have anchorY for multiple points'
    );
});
