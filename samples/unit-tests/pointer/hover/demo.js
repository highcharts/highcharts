QUnit.test(
    'Tooltip isn\'t displayed when on column, when yAxis.max is lower than column\'s value. (#4511)',
    function (assert) {
        var chart = $('#container')
            .highcharts({
                chart: {
                    type: 'column'
                },
                yAxis: {
                    max: 5
                },
                tooltip: {
                    shared: true
                },
                series: [
                    {
                        data: [29.9, 71.5, 106.4]
                    }
                ]
            })
            .highcharts();

        chart.pointer.onContainerMouseMove({
            pageX: 150,
            pageY: 310,
            target: chart.series[0].group.element
        });

        assert.strictEqual(
            chart.tooltip.isHidden,
            false,
            'Tooltip displayed properly'
        );
    }
);

QUnit.test(
    'JS error on hovering after destroy chart (#4998)',
    function (assert) {
        var chart,
            options = {
                xAxis: {
                    categories: [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec'
                    ]
                },

                series: [
                    {
                        data: [
                            29.9,
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
                        type: 'column'
                    }
                ]
            };

        chart = Highcharts.chart('container', options);

        chart.pointer.onContainerMouseMove({
            pageX: 200,
            pageY: 200,
            type: 'mousemove'
        });
        assert.ok(true, 'No error yet');

        // Create a new chart
        chart = Highcharts.chart('container', options);

        chart.pointer.onContainerMouseMove({
            pageX: 200,
            pageY: 200,
            type: 'mousemove'
        });
        assert.ok(true, 'No error');
    }
);

QUnit.test('Testing hovering over panes.', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                polar: true,
                plotBackgroundColor: '#f2f2f2'
            },

            pane: [
                {
                    center: ['25%', '50%']
                },
                {
                    center: ['75%', '50%']
                }
            ],

            series: [
                {
                    data: [140, 130, 53, 54, 50]
                },
                {
                    data: [120, 32, 64, 142],
                    yAxis: 1,
                    xAxis: 1
                }
            ],

            xAxis: [
                {
                    pane: 0
                },
                {
                    pane: 1
                }
            ],

            yAxis: [
                {
                    max: 100,
                    pane: 0
                },
                {
                    max: 100,
                    pane: 1
                }
            ]
        }),
        controller = new TestController(chart),
        x = 260,
        y = 180;

    controller.moveTo(x, y);

    assert.strictEqual(
        chart.hoverPoint,
        chart.series[0].points[2],
        'The other pane\'s point should be ignored' // #11148
    );

    chart.tooltip.hide(0);

    x = 300;
    y = 180;
    controller.setPosition(x - 1, y - 1);
    controller.moveTo(x, y);

    assert.ok(
        chart.tooltip.isHidden,
        'Tooltip should not be displayed' // #11148
    );

    x = 340;
    y = 180;
    controller.setPosition(x - 1, y - 1);
    controller.moveTo(x, y);

    assert.ok(
        chart.tooltip.isHidden,
        'Tooltip should not be displayed (point is out of pane)' // #11148
    );

    chart.update(
        {
            tooltip: {
                shared: true
            }
        },
        false
    );

    chart.addSeries({
        data: [125, 110, 43, 44, 20]
    });

    chart.series[0].points[0].onMouseOver();

    assert.ok(
        !chart.tooltip.isHidden,
        'Tooltip should be displayed without any errors' // #12856
    );
});

QUnit.test('Tooltip should be shown for value equal to max', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            polar: true,
            type: 'line'
        },

        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0,
            max: 100
        },

        series: [
            {
                data: [99, 100, 101, 36, 47, 16],
                pointPlacement: 'on'
            }
        ]
    });

    const controller = new TestController(chart);

    const series = chart.series[0];
    let point = series.points[1];
    controller.mouseMove(point.plotX, point.plotY);
    assert.strictEqual(
        chart.tooltip.isHidden,
        true,
        'Tooltip at max + 1 should be hidden'
    );

    point = series.points[2];
    controller.mouseMove(point.plotX, point.plotY);
    assert.strictEqual(
        chart.tooltip.isHidden,
        false,
        'Tooltip at max should be drawn'
    );
});

QUnit.test('Hover state when axis is updated (#12569).', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [
            {
                data: [1, 4, null, 6, 7],
                step: 'right'
            }
        ],
        plotOptions: {
            series: {
                point: {
                    events: {
                        mouseOver: function () {
                            this.series.chart.yAxis[0].update({
                                title: {
                                    style: {
                                        color: this.color
                                    }
                                }
                            });
                        }
                    }
                }
            }
        }
    });

    var controller = new TestController(chart),
        series = chart.series[0],
        point = series.points[1];

    controller.moveTo(point.plotX, point.plotY);

    assert.ok(
        series.halo && series.halo.visibility !== 'hidden',
        'Halo and hover state should be visible.'
    );
});

QUnit.test('Polar chart without stickyTracking, #17359.', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                polar: true
            },
            series: [{
                stickyTracking: false,
                data: [1, 2, 3, 4, 5]
            }]
        }),
        controller = new TestController(chart),
        x = 300,
        y = 120;

    controller.setPosition(x - 1, y - 1);
    controller.moveTo(x, y);

    assert.ok(
        chart.tooltip.isHidden,
        'The tooltip should not be displayed when not hovering over the series.'
    );
});
