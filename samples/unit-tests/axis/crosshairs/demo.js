QUnit.test('Crosshair on multiple axes (#4927)', function (assert) {
    const sampleData = [20, 12, 50, 40],
        yAxisCrosshair = {
            crosshair: {
                label: {
                    enabled: true
                }
            }
        };

    var chart = Highcharts.stockChart('container', {
        yAxis: [
            {
                id: 'primary',
                crosshair: true
            },
            {
                id: 'secondary',
                crosshair: true,
                opposite: true
            }
        ],
        tooltip: {
            shared: true
        },
        plotOptions: {
            series: {
                kdNow: true
            }
        },
        series: [
            {
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
                ]
            },
            {
                yAxis: 1,
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
                ]
            }
        ]
    });

    var offset = Highcharts.offset(chart.renderTo);

    chart.series[0].points[0].onMouseOver();
    chart.pointer.onContainerMouseMove({
        type: 'mousemove',
        pageX: offset.left + 300,
        pageY: offset.top + 300,
        target: chart.container
    });

    assert.strictEqual(
        chart.yAxis[0].cross.element.nodeName,
        'path',
        'Primary axis has cross'
    );

    assert.strictEqual(
        chart.yAxis[1].cross.element.nodeName,
        'path',
        'Secondary axis has cross'
    );

    chart.update({
        yAxis: [{
            ...yAxisCrosshair,
            opposite: false
        },
        {
            ...yAxisCrosshair,
            opposite: false
        }, {
            ...yAxisCrosshair,
            opposite: true
        }, {
            ...yAxisCrosshair,
            opposite: true
        }],
        series: [
            {
                data: sampleData
            },
            {
                yAxis: 1,
                data: sampleData
            },
            {
                yAxis: 2,
                data: sampleData
            },
            {
                yAxis: 3,
                data: sampleData
            }
        ]
    }, true, true);

    chart.series[0].points[0].onMouseOver();

    chart.yAxis.forEach(function (axis) {
        if (axis.crossLabel) {
            if (axis.opposite) {
                assert.strictEqual(
                    axis.crossLabel.x,
                    axis.left + axis.width + axis.offset,
                    'Opposite yAxis crossLabel positions correctly, #16940'
                );
            } else {
                assert.strictEqual(
                    axis.crossLabel.x,
                    axis.left + axis.offset -
                    (axis.crossLabel.getBBox().width / 2),
                    'Not opposite yAxis crossLabels position correctly, #16940'
                );
            }
        }
    });
});

QUnit.test('Crosshair with snap false', function (assert) {
    var chart = Highcharts.chart('container', {
        xAxis: {
            crosshair: {
                snap: false,
                label: {
                    enabled: true
                }
            }
        },

        yAxis: {
            crosshair: {
                snap: false
            }
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
    });

    var controller = new TestController(chart);
    controller.mouseMove(500, 100);

    assert.strictEqual(
        chart.xAxis[0].cross.element.nodeName,
        'path',
        'X axis should have crosshair (#5066)'
    );

    assert.strictEqual(
        chart.yAxis[0].cross.element.nodeName,
        'path',
        'Y axis should have crosshair (#5066)'
    );

    assert.ok(
        chart.xAxis[0].crossLabel.x > 300,
        'X axis cross label should be on the right side of the chart (#20856)'
    );

    chart.renderTo.style.position = 'static';
});
QUnit.test(
    'Update crosshair\'s stroke-width after resize.(#4737)',
    function (assert) {
        var chart = $('#container')
                .highcharts({
                    xAxis: {
                        type: 'category'
                    },
                    tooltip: {
                        crosshairs: [true, false]
                    },
                    series: [
                        {
                            data: [5, 10, 15]
                        }
                    ]
                })
                .highcharts(),
            offset = $('#container').offset(),
            point = chart.series[0].points[0],
            x = offset.left + 50,
            y = offset.top + 50;

        chart.pointer.onContainerMouseMove({
            pageX: x,
            pageY: y,
            target: point.graphic.element
        });

        chart.setSize(300, 400);

        chart.pointer.onContainerMouseMove({
            pageX: x + 30,
            pageY: y,
            target: point.graphic.element
        });

        assert.equal(
            chart.xAxis[0].cross.attr('stroke-width'),
            chart.xAxis[0].transA,
            'Proper width after resize'
        );
    }
);

QUnit.test('snap', function (assert) {
    var chart = Highcharts.chart('container', {
            xAxis: {
                crosshair: {
                    snap: true
                }
            },
            yAxis: {
                crosshair: {
                    snap: true
                }
            },
            plotOptions: {
                series: {
                    kdNow: true
                }
            },
            series: [
                {
                    type: 'bubble',
                    data: [[1, 1, 1]]
                }
            ]
        }),
        point = chart.series[0].points[0],
        xAxis = chart.xAxis[0],
        yAxis = chart.yAxis[0];

    assert.strictEqual(
        !!xAxis.cross,
        false,
        'before interaction: crosshair on xAxis is not drawn.'
    );
    assert.strictEqual(
        !!yAxis.cross,
        false,
        'before interaction: crosshair on yAxis is not drawn.'
    );

    point.onMouseOver();
    assert.strictEqual(
        !!xAxis.cross,
        true,
        'mouseOver: crosshair on xAxis is added.'
    );
    assert.strictEqual(
        !!yAxis.cross,
        true,
        'mouseOver: crosshair on yAxis is added.'
    );

    // TODO Remove crosshairs on mouseOut
    // point.onMouseOut();
    // assert.strictEqual(
    //     !!xAxis.cross,
    //     false,
    //     'mouseOut: crosshair on xAxis is removed.'
    // );
    // assert.strictEqual(
    //     !!yAxis.cross,
    //     false,
    //     'mouseOut: crosshair on yAxis is removed.'
    // );

    // TODO Test positioning of crosshairs.
});

QUnit.test('Show only one crosshair at the same time', function (assert) {
    var chart = Highcharts.chart('container', {
            xAxis: [
                {
                    crosshair: true
                },
                {
                    opposite: true,
                    crosshair: true
                }
            ],
            yAxis: [
                {
                    height: '50%',
                    crosshair: {
                        snap: false,
                        label: {
                            enabled: true
                        }
                    }
                },
                {
                    top: '50%',
                    height: '50%',
                    crosshair: {
                        snap: false,
                        label: {
                            enabled: true
                        }
                    }
                }
            ],
            series: [
                {
                    name: 'Installation',
                    data: [1, 2, 3],
                    xAxis: 0,
                    yAxis: 0
                },
                {
                    name: 'Manufacturing',
                    data: [1, 2, 3].reverse(),
                    xAxis: 1,
                    yAxis: 1
                }
            ]
        }),
        series1 = chart.series[0],
        series2 = chart.series[1];

    series1.points[0].onMouseOver();
    assert.strictEqual(
        series1.xAxis.cross.attr('visibility'),
        'inherit',
        'Hover Series 1: crosshair on xAxis of Series 1 is visible (#6420)'
    );
    assert.strictEqual(
        !!series2.xAxis.cross,
        false,
        'Hover Series 1: crosshair on xAxis of Series 2 does not exist (#6420)'
    );
    assert.strictEqual(
        series1.yAxis.crossLabel.attr('visibility'),
        'inherit',
        'Hover Series 1: crosshair label on yAxis of Series 1 is visible ' +
            '(#7219)'
    );
    assert.strictEqual(
        !!series2.yAxis.crossLabel,
        false,
        'Hover Series 1: crosshair label on yAxis of Series 2 does not ' +
            'exist (#7219)'
    );

    series2.points[2].onMouseOver();
    assert.strictEqual(
        series1.xAxis.cross.attr('visibility'),
        'hidden',
        'Hover Series 2: crosshair on xAxis of Series 1 is hidden (#6420)'
    );
    assert.strictEqual(
        series2.xAxis.cross.attr('visibility'),
        'inherit',
        'Hover Series 2: crosshair on xAxis of Series 2 is visible (#6420)'
    );

    series1.points[1].onMouseOver();
    assert.strictEqual(
        series1.yAxis.crossLabel.visibility,
        'inherit',
        'Hover Series 1 back: crosshair label on yAxis of Series 1 is ' +
            'visible (#7219)'
    );
    assert.strictEqual(
        series2.yAxis.crossLabel.attr('visibility'),
        'hidden',
        'Hover Series 1 back: crosshair label on yAxis of Series 2 is ' +
            'hidden (#7219)'
    );

    chart.update({
        yAxis: [
            {
                crosshair: {
                    snap: true,
                    label: {
                        enabled: false
                    }
                }
            },
            {
                crosshair: {
                    snap: true,
                    label: {
                        enabled: false
                    }
                }
            }
        ]
    });

    chart.update({
        yAxis: [
            {
                crosshair: {
                    label: {
                        enabled: true
                    }
                }
            },
            {
                crosshair: {
                    label: {
                        enabled: true
                    }
                }
            }
        ]
    });

    assert.strictEqual(
        series1.yAxis.crossLabel.attr('visibility'),
        'inherit',
        'Crosshair should be visible for the first series (#12298)'
    );
    assert.strictEqual(
        typeof series2.yAxis.crossLabel,
        'undefined',
        'Crosshair should not be visible for the second series  (#12298)'
    );
});

QUnit.test('Use correct hover point for axis.', function (assert) {
    var AxisPrototype = Highcharts.Axis.prototype,
        drawCrosshair = AxisPrototype.drawCrosshair,
        events = [],
        override = function (e, p) {
            var txt = [
                this.isXAxis ? 'xAxis' : 'yAxis',
                'side: ' + this.side,
                'point: ' + (p ? p.series.name + '.' + p.index : 'undefined')
            ].join();
            events.push(txt);
            drawCrosshair.call(this, e, p);
        },
        options = {
            yAxis: [
                {
                    crosshair: true
                },
                {
                    opposite: true,
                    crosshair: true
                }
            ],
            tooltip: {
                shared: true
            },
            series: [
                {
                    name: 'A',
                    data: [1, 2, 3],
                    yAxis: 0
                },
                {
                    name: 'B',
                    data: [1, 2, 3].reverse(),
                    yAxis: 1
                }
            ]
        },
        chart,
        series;
    AxisPrototype.drawCrosshair = override;
    chart = Highcharts.chart('container', options);
    series = chart.series[0];
    series.points[0].onMouseOver();
    assert.strictEqual(
        events.shift(),
        'xAxis,side: 2,point: A.0',
        'xAxis is assigned point A.0 (#6860).'
    );
    assert.strictEqual(
        events.shift(),
        'yAxis,side: 3,point: A.0',
        'yAxis left side is assigned point A.0 (#6860).'
    );
    assert.strictEqual(
        events.shift(),
        'yAxis,side: 1,point: B.0',
        'yAxis on right side is assigned point B.0 (#6860).'
    );
    // restore to default function
    AxisPrototype.drawCrosshair = drawCrosshair;

    chart = Highcharts.chart('container', {
        yAxis: {
            crosshair: true
        },
        tooltip: {
            shared: true
        },
        series: [
            {
                data: [50.9, 71.5, 106.4, 129.2, 144.0]
            },
            {
                data: [9.9, 7.5, 36.4, 19.2, 14.0, 16.0]
            }
        ]
    });

    var point1 = chart.series[1].points[2],
        point2 = chart.series[0].points[2];

    point1.onMouseOver();
    assert.ok(
        Math.abs(
            point1.series.yAxis.cross.getBBox().y -
                (point1.plotY + chart.plotTop)
        ) < 1,
        'Crosshair should be placed correctly when tooltip is shared (#13002).'
    );

    point2.onMouseOver();
    assert.ok(
        Math.abs(
            point2.series.yAxis.cross.getBBox().y -
                (point2.plotY + chart.plotTop)
        ) < 1,
        'Crosshair should be placed correctly when tooltip is shared (#13002).'
    );
});

QUnit.test(
    'Show crosshair label on logarithmic axis correctly. #8542',
    function (assert) {
        var chart = Highcharts.chart('container', {
            xAxis: {
                crosshair: true
            },

            yAxis: {
                type: 'logarithmic',
                crosshair: {
                    enabled: true,
                    label: {
                        enabled: true
                    }
                }
            },

            series: [
                {
                    data: [1, 512],
                    pointStart: 1
                }
            ]
        });

        chart.series[0].points[1].onMouseOver();

        assert.strictEqual(
            chart.yAxis[0].crossLabel.attr('visibility'),
            'inherit',
            'Crosshair label is visible on logarithmic ' +
                'axis for the second point (#8542)'
        );
    }
);

QUnit.test(
    'Set crosshair stroke-width correctly in StyledMode #11246',
    function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'column',
                styledMode: true
            },

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
                ],
                crosshair: true
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
                    ]
                }
            ]
        });

        chart.series[0].points[1].onMouseOver();

        assert.strictEqual(
            Highcharts.defined(
                chart.xAxis[0].cross.element.attributes['stroke-width']
            ),
            true,
            'Crosshair should has stroke-width attribute (#11246)'
        );
    }
);

QUnit.test(
    'Crosshairs label should be correctly justified.',
    function (assert) {
        const chart = Highcharts.chart('container', {
            xAxis: {
                crosshair: true
            },

            tooltip: {
                enabled: false
            },
            yAxis: {
                title: '',
                opposite: false,
                crosshair: {
                    label: {
                        enabled: true,
                        format: '{value:.2f}'
                    }
                },
                labels: {
                    align: 'left',
                    format: '{value:.2f}',
                    y: 6,
                    x: 2
                }
            },

            series: [
                {
                    data: [1, 2, 34, 23, 43, 3]
                }
            ]
        });

        chart.series[0].points[3].onMouseOver();

        const yAxis = chart.yAxis[0];
        assert.equal(
            yAxis.crossLabel.x >= 0,
            true,
            'Crosshair label is justified'
        );
    }
);
