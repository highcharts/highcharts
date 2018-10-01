/**
 * Tests the isNavigatorAxis() function
 */
QUnit.test('isNavigatorAxis()', function (assert) {
    var chart = Highcharts.stockChart('container', {
        chart: {
            type: 'bar'
        },
        series: [{
            data: [129.9, 271.5, 306.4, -29.2, 544.0, 376.0, 435.6, 348.5]
        }]
    });

    assert.notOk(
        chart.xAxis[0].isNavigatorAxis(),
        'xAxis[0] is not a navigator axis'
    );

    assert.ok(
        chart.xAxis[1].isNavigatorAxis(),
        'xAxis[1] is a navigator axis'
    );
});

/**
 * Tests the isOuterAxis() function
 */
QUnit.test('isOuterAxis()', function (assert) {
    var chart = Highcharts.stockChart('container', {
        chart: {
            type: 'bar'
        },
        xAxis: [{
            grid: {
                enabled: true
            },
            opposite: false
        }, {
            grid: {
                enabled: true
            },
            opposite: false
        }, {
            grid: {
                enabled: true
            },
            opposite: true
        }, {
            grid: {
                enabled: true
            },
            opposite: true
        }],
        series: [{
            data: [129.9, 271.5, 306.4, -29.2, 544.0, 376.0, 435.6, 348.5],
            xAxis: 0
        }, {
            data: [29.9, -71.5, -106.4, -129.2, -144.0, -176.0, -135.6, -148.5],
            xAxis: 1
        }, {
            data: [129.9, 271.5, 306.4, -29.2, 544.0, 376.0, 435.6, 348.5],
            xAxis: 2
        }, {
            data: [29.9, -71.5, -106.4, -129.2, -144.0, -176.0, -135.6, -148.5],
            xAxis: 3
        }]
    });

    assert.ok(
        chart.xAxis[1].isOuterAxis(),
        'Leftmost left x-axis is outerAxis'
    );

    assert.notOk(
        chart.xAxis[2].isOuterAxis(),
        'Leftmost right x-axis is not outerAxis'
    );

    assert.ok(
        chart.xAxis[3].isOuterAxis(),
        'Rightmost right x-axis is outerAxis'
    );
});

/**
 * Tests the additions to Highcharts.dateFormats
 */
QUnit.test('dateFormats', function (assert) {
    assert.equal(
        typeof Highcharts.dateFormats.W,
        'function',
        'Weeks format exists'
    );

    assert.equal(
        typeof Highcharts.dateFormats.E,
        'function',
        'Single character week day format exists'
    );

    assert.equal(
        Highcharts.dateFormats.W(Date.UTC(2016, 8, 15)), // September 15th 2016
        37,
        'Week format produces correct output'
    );

    assert.equal(
        Highcharts.dateFormats.E(Date.UTC(2016, 8, 15)), // September 15th 2016
        'T',
        'Signle character week day format produces correct output'
    );
});

/**
 * Tests the vertical linear axis horizontal placement
 */
QUnit.test('Vertical Linear axis horizontal placement', function (assert) {
    var chart,
        axes = [],
        error;

    // Chart 1
    chart = Highcharts.stockChart('container', {
        chart: {
            type: 'line'
        },
        yAxis: [{
            grid: {
                enabled: true
            },
            id: 'axis1',
            opposite: false
        }, {
            grid: {
                enabled: true
            },
            id: 'axis2',
            opposite: false
        }, {
            grid: {
                enabled: true
            },
            opposite: true,
            linkedTo: 0,
            id: 'axis3'
        }, {
            grid: {
                enabled: true
            },
            opposite: true,
            linkedTo: 1,
            id: 'axis4'
        }],
        series: [{
            data: [129.9, 271.5, 306.4, -29.2, 544.0, 376.0, 435.6, 348.5],
            yAxis: 0
        }, {
            data: [29.9, -71.5, -106.4, -129.2, -144.0, -176.0, -135.6, -148.5],
            yAxis: 1
        }]
    });

    axes[0] = chart.yAxis[0].axisGroup.getBBox();
    axes[1] = chart.yAxis[1].axisGroup.getBBox();
    axes[2] = chart.yAxis[2].axisGroup.getBBox();
    axes[3] = chart.yAxis[3].axisGroup.getBBox();

    error = 1;

    assert.close(
        axes[1].x + axes[1].width,
        Math.round(axes[0].x),
        error,
        'Left outer linear axis horizontal placement'
    );

    assert.close(
        axes[3].x,
        Math.round(axes[2].x + axes[2].width),
        error,
        'Right outer linear axis horizontal placement'
    );
});

/**
 * Tests the vertical datetime axis horizontal placement
 */
QUnit.test('Vertical Datetime axis horizontal placement', function (assert) {
    var chart,
        axes = [],
        error;

    chart = Highcharts.stockChart('container', {
        title: {
            type: 'scatter'
        },
        yAxis: [{
            grid: {
                enabled: true
            },
            id: 'axis1',
            opposite: false,
            tickInterval: 1000 * 60 * 60 * 24, // Day
            type: 'datetime',
            labels: {
                format: '{value:%E}',
                style: {
                    fontSize: '2em'
                }
            },
            min: Date.UTC(2014, 10, 18),
            max: Date.UTC(2014, 10, 21)
        }, {
            grid: {
                enabled: true
            },
            id: 'axis2',
            opposite: false,
            tickInterval: 1000 * 60 * 60 * 24, // Day
            type: 'datetime',
            labels: {
                format: '{value:%E}',
                style: {
                    fontSize: '1em'
                }
            },
            linkedTo: 0
        }, {
            grid: {
                enabled: true
            },
            id: 'axis3',
            opposite: true,
            tickInterval: 1000 * 60 * 60 * 24, // Day
            type: 'datetime',
            labels: {
                format: '{value:%E}',
                style: {
                    fontSize: '1em'
                }
            },
            linkedTo: 0
        }, {
            grid: {
                enabled: true
            },
            id: 'axis4',
            opposite: true,
            tickInterval: 1000 * 60 * 60 * 24, // Day
            type: 'datetime',
            labels: {
                format: '{value:%E}',
                style: {
                    fontSize: '1em'
                }
            },
            linkedTo: 0
        }],
        series: [{
            name: 'Project 3',
            borderRadius: 10,
            data: [{
                x: 7,
                x2: 9,
                y: Date.UTC(2014, 10, 19)
            }, {
                x: 7,
                x2: 12,
                y: Date.UTC(2014, 10, 20)
            }, {
                x: 12,
                x2: 13,
                y: Date.UTC(2014, 10, 21)
            }]
        }]
    });

    axes[0] = chart.yAxis[0].axisGroup.getBBox();
    axes[1] = chart.yAxis[1].axisGroup.getBBox();
    axes[2] = chart.yAxis[2].axisGroup.getBBox();
    axes[3] = chart.yAxis[3].axisGroup.getBBox();

    error = 1;

    assert.close(
        axes[1].x + axes[1].width,
        axes[0].x,
        error,
        'Left outer datetime axis horizontal placement'
    );

    assert.close(
        axes[3].x,
        Math.round(axes[2].x + axes[2].width),
        error,
        'Right outer datetime axis horizontal placement'
    );
});

/**
 * Tests the horizontal linear axis vertical placement
 */
QUnit.test('Horizontal Linear axis vertical placement', function (assert) {
    var chart,
        axes = [],
        error;

    // Chart 1
    chart = Highcharts.stockChart('container', {
        chart: {
            type: 'line'
        },
        xAxis: [{
            grid: {
                enabled: true
            },
            opposite: false,
            id: 'axis1'
        }, {
            grid: {
                enabled: true
            },
            opposite: false,
            id: 'axis2'
        }, {
            grid: {
                enabled: true
            },
            opposite: true,
            linkedTo: 0,
            id: 'axis3'
        }, {
            grid: {
                enabled: true
            },
            opposite: true,
            linkedTo: 1,
            id: 'axis4'
        }],
        series: [{
            data: [129.9, 271.5, 306.4, -29.2, 544.0, 376.0, 435.6, 348.5],
            xAxis: 0
        }, {
            data: [29.9, -71.5, -106.4, -129.2, -144.0, -176.0, -135.6, -148.5],
            xAxis: 1
        }]
    });

    axes[0] = chart.xAxis[0].axisGroup.getBBox();
    axes[1] = chart.xAxis[1].axisGroup.getBBox();
    axes[2] = chart.xAxis[2].axisGroup.getBBox();
    axes[3] = chart.xAxis[3].axisGroup.getBBox();

    error = 0.00001;

    assert.close(
        axes[1].y,
        axes[0].y + axes[0].height,
        error,
        'Bottom outer linear axis vertical placement'
    );

    assert.close(
        axes[3].y + axes[3].height,
        axes[2].y,
        error,
        'Top outer linear axis vertical placement'
    );
});

/**
 * Tests the horizontal datetime axis vertical placement
 */
QUnit.test('Horizontal Datetime axis vertical placement', function (assert) {
    var chart,
        axes = [],
        error;

    chart = Highcharts.stockChart('container', {
        title: {
            type: 'scatter'
        },
        xAxis: [{
            grid: {
                enabled: true
            },
            id: 'axis1',
            opposite: false,
            tickInterval: 1000 * 60 * 60 * 24, // Day
            type: 'datetime',
            labels: {
                format: '{value:%E}',
                style: {
                    fontSize: '2em'
                }
            },
            min: Date.UTC(2014, 10, 18),
            max: Date.UTC(2014, 10, 21)
        }, {
            grid: {
                enabled: true
            },
            id: 'axis2',
            opposite: false,
            tickInterval: 1000 * 60 * 60 * 24, // Day
            type: 'datetime',
            labels: {
                format: '{value:%E}',
                style: {
                    fontSize: '1em'
                }
            },
            linkedTo: 0
        }, {
            grid: {
                enabled: true
            },
            id: 'axis3',
            opposite: true,
            tickInterval: 1000 * 60 * 60 * 24, // Day
            type: 'datetime',
            labels: {
                format: '{value:%E}',
                style: {
                    fontSize: '1em'
                }
            },
            linkedTo: 0
        }, {
            grid: {
                enabled: true
            },
            id: 'axis4',
            opposite: true,
            tickInterval: 1000 * 60 * 60 * 24, // Day
            type: 'datetime',
            labels: {
                format: '{value:%E}',
                style: {
                    fontSize: '1em'
                }
            },
            linkedTo: 0
        }],
        series: [{
            name: 'Project 3',
            borderRadius: 10,
            data: [{
                y: 0,
                x: Date.UTC(2014, 10, 19),
                x2: Date.UTC(2014, 10, 20)
            }, {
                y: 1,
                x: Date.UTC(2014, 10, 20),
                x2: Date.UTC(2014, 10, 21)
            }, {
                y: 2,
                x: Date.UTC(2014, 10, 21),
                x2: Date.UTC(2014, 10, 22)
            }]
        }]
    });

    axes[0] = chart.xAxis[0].axisGroup.getBBox();
    axes[1] = chart.xAxis[1].axisGroup.getBBox();
    axes[2] = chart.xAxis[2].axisGroup.getBBox();
    axes[3] = chart.xAxis[3].axisGroup.getBBox();

    error = 0.00001;

    assert.close(
        axes[1].y,
        axes[0].y + axes[0].height,
        error,
        'Bottom outer datetime axis vertical placement'
    );

    assert.close(
        axes[3].y + axes[3].height,
        axes[2].y,
        error,
        'Top outer datetime axis vertical placement'
    );
});

/**
 * Checks that horizontal axes for each series type (except 'pie') have ticks
 * placed at the start and end of the axis, creating a grid:
 *   ___________________
 *   |__|__|__|__|__|__|
 *   ^                 ^
 */
QUnit.test('Horizontal axis ticks at start and end', function (assert) {
    var chart,
        types = Highcharts.seriesTypes,
        // No grids for pies!
        ignoreTypes = ['pie'],
        ignore,
        type;

    chart = Highcharts.stockChart('container', {
        chart: {
            type: 'column'
        },
        xAxis: [{
            grid: {
                enabled: true
            },
            opposite: false
        }, {
            opposite: false,
            grid: {
                enabled: true
            }
        }, {
            grid: {
                enabled: true
            },
            opposite: true
        }, {
            grid: {
                enabled: true
            },
            opposite: true
        }],
        series: [{
            xAxis: 0,
            data: [{
                x: Date.UTC(2016, 10, 12),
                y: 1
            }, {
                x: Date.UTC(2016, 10, 14),
                y: 2
            }]
        }, {
            xAxis: 1,
            data: [{
                x: Date.UTC(2016, 10, 12),
                y: 1
            }, {
                x: Date.UTC(2016, 10, 14),
                y: 2
            }]
        }, {
            xAxis: 2,
            data: [{
                x: Date.UTC(2016, 10, 12),
                y: 1
            }, {
                x: Date.UTC(2016, 10, 14),
                y: 2
            }]
        }, {
            xAxis: 3,
            data: [{
                x: Date.UTC(2016, 10, 13),
                y: 1
            }, {
                x: Date.UTC(2016, 10, 15),
                y: 2
            }]
        }]
    });



    function test(type) {
        var axes,
            axis,
            $axisGroup,
            axisGroupBox,
            leftTick,
            rightTick,
            ticks,
            i;

        chart.options.chart.type = type;
        chart = Highcharts.stockChart('container', chart.options);

        axes = chart.xAxis;
        for (i = 0; i < axes.length; i++) {
            axis = axes[0];
            $axisGroup = $(axis.axisGroup.element);
            axisGroupBox = $axisGroup[0].getBBox();
            ticks = $axisGroup.find('.highcharts-tick');
            leftTick = ticks[0];
            rightTick = ticks.slice(-1)[0];

            assert.equal(
                leftTick.getBBox().x,
                axisGroupBox.x,
                type + ' chart leftmost tick is placed correctly'
            );

            assert.equal(
                rightTick.getBBox().x,
                axisGroupBox.x + axisGroupBox.width,
                type + ' chart rightmost tick is placed correctly'
            );
        }
    }

    types = {
        column: true
    };

    for (type in types) {
        if (types.hasOwnProperty(type)) {
            ignore = Highcharts.inArray(type, ignoreTypes) > -1;
            if (!ignore) {
                test(type);
            }
        }
    }
});

/**
 * Checks that the ticks in independent horizontal axes are equally distributed,
 * by checking that the space between the first and second tick is equal to the
 * second last and last tick:
 *
 *               _________________________
 * Avoid this:   |______|______|______|__|
 *                  ^                  ^
 *               _________________________
 * Want this:    |_____|_____|_____|_____|
 *                  ^                 ^
 *
 * It is however fine that ticks in axes which are linked to other axes are not
 * equally distributed, because they may not have the same tick interval as the
 * inner axes.
 */
QUnit.test('Horizontal axis ticks equally distributed', function (assert) {
    var chart,
        axes,
        i,
        axis,
        // There is often a 1px difference in spacing between ticks
        error = 1.0000000000001,
        ticks,
        $axisGroup,
        axisGroupBox,
        secondLeftmostTick,
        secondRightmostTick,
        axisLeftPoint,
        axisRightPoint,
        leftSpace,
        rightSpace;

    chart = Highcharts.stockChart('container', {
        chart: {
            type: 'scatter'
        },
        xAxis: [{
            grid: {
                enabled: true
            },
            opposite: false,
            tickInterval: 1000 * 60 * 60 * 24 // Day
        }, {
            grid: {
                enabled: true
            },
            opposite: false,
            tickInterval: 1000 * 60 * 60 * 24 // Day
        }, {
            grid: {
                enabled: true
            },
            opposite: true,
            tickInterval: 1000 * 60 * 60 * 24 // Day
        }, {
            grid: {
                enabled: true
            },
            opposite: true,
            tickInterval: 1000 * 60 * 60 * 24 // Day
        }],
        series: [{
            xAxis: 0,
            data: [{
                x: Date.UTC(2016, 10, 12),
                y: 1
            }, {
                x: Date.UTC(2016, 10, 14),
                y: 2
            }]
        }, {
            xAxis: 1,
            data: [{
                x: Date.UTC(2016, 10, 12),
                y: 1
            }, {
                x: Date.UTC(2016, 10, 14),
                y: 2
            }]
        }, {
            xAxis: 2,
            data: [{
                x: Date.UTC(2016, 10, 12),
                y: 1
            }, {
                x: Date.UTC(2016, 10, 14),
                y: 2
            }]
        }, {
            xAxis: 3,
            data: [{
                x: Date.UTC(2016, 10, 13),
                y: 1
            }, {
                x: Date.UTC(2016, 10, 15),
                y: 2
            }]
        }]
    });

    axes = chart.xAxis;

    for (i = 0; i < 4; i++) {
        axis = axes[i];
        $axisGroup = $(axis.axisGroup.element);
        ticks = $axisGroup.find('.highcharts-tick');
        secondLeftmostTick = ticks[1];
        secondRightmostTick = ticks.slice(-2)[0];
        axisGroupBox = $axisGroup[0].getBBox();
        axisLeftPoint = axisGroupBox.x;
        axisRightPoint = axisGroupBox.x + axisGroupBox.width;
        leftSpace = secondLeftmostTick.getBBox().x - axisLeftPoint;
        rightSpace = axisRightPoint - secondRightmostTick.getBBox().x;

        assert.close(
            rightSpace,
            leftSpace,
            error,
            'Left space is equal to right space in xAxis[' + i + ']'
        );
    }
});

/**
 * Checks that the tick labels in horizontal axes are centered in their cells,
 * both vertically and horizontally. This is checked by asserting that the
 * midpoint of each tick label is the same as the midpoint between the tick it
 * belongs to, and the next one.
 *
 *                        _________________________________
 *                        |       |       |   3   |       |
 * Avoid any of these:    |      1|2      |       |       |
 *                        |_______|_______|_______|___4___|
 *
 *                        _________________________________
 *                        |       |       |       |       |
 * Want this for ranges:  |   1   |   2   |   3   |   4   |
 *                        |_______|_______|_______|_______|
 *                        _________________________________
 *                        |       |       |       |       |
 * And this for punctual: |01:01  |02:00  |03:00  |04:00  |
 *                        |_______|_______|_______|_______|
 */
QUnit.test('Horizontal axis tick labels centered', function (assert) {
    var chart,
        axes,
        xError = 1.1,
        yError = 1.1;

    chart = Highcharts.stockChart('container', {
        chart: {
            type: 'scatter'
        },
        xAxis: [{
            grid: {
                enabled: true
            },
            tickInterval: 1000 * 60 * 60 * 24, // Day
            opposite: false
        }, {
            min: Date.UTC(2016, 10, 11),
            max: Date.UTC(2016, 10, 15),
            tickInterval: 1000 * 60 * 60 * 24, // Day
            grid: {
                enabled: true
            },
            opposite: false
        }, {
            grid: {
                enabled: true
            },
            tickInterval: 1000 * 60 * 60 * 24, // Day
            opposite: true
        }, {
            grid: {
                enabled: true
            },
            min: Date.UTC(2016, 10, 12),
            max: Date.UTC(2016, 10, 16),
            tickInterval: 1000 * 60 * 60 * 24 * 7, // Week
            opposite: true
        }],
        series: [{
            xAxis: 0,
            data: [[Date(2016, 10, 12), 271.5], [Date(2016, 10, 12, 12), -29.2], [Date(2016, 10, 13), 376.0]]
        }, {
            xAxis: 1,
            data: [{
                x: Date.UTC(2016, 10, 12),
                y: 1
            }, {
                x: Date.UTC(2016, 10, 14),
                y: 2
            }]
        }, {
            xAxis: 2,
            data: [[1000 * 60, -71.5], [2000 * 60, -129.2], [3000 * 60, -176.0]]
        }, {
            xAxis: 3,
            data: [{
                x: Date.UTC(2016, 10, 13),
                y: 1
            }, {
                x: Date.UTC(2016, 10, 15),
                y: 2
            }]
        }]
    });

    axes = Highcharts.grep(chart.xAxis, function (axis) {
        return !axis.isNavigatorAxis();
    });

    Highcharts.each(axes, function (axis) {
        var axisType = axis.options.type || 'linear',
            tickPositions = axis.tickPositions,
            ticks = axis.ticks,
            tick,
            nextTick,
            tickBox,
            nextTickBox,
            labelBox,
            actual,
            expected,
            i;

        if (!axisType) {
            if (axis.options.categories) {
                axisType = 'categories';
            } else {
                axisType = 'linear';
            }
        }

        for (i = 0; i < tickPositions.length; i++) {
            tick = ticks[tickPositions[i]];
            nextTick = ticks[tickPositions[i + 1]];
            if (tick.mark && tick.label && nextTick && nextTick.mark) {
                tickBox = tick.mark.element.getBBox();
                nextTickBox = nextTick.mark.element.getBBox();
                labelBox = tick.label.element.getBBox();
                expected = {
                    x: (nextTickBox.x + tickBox.x) / 2,
                    y: tickBox.y + (tickBox.height / 2)
                };
                actual = {
                    x: labelBox.x + (labelBox.width / 2),
                    y: labelBox.y + (labelBox.height / 2)
                };

                assert.close(
                    actual.x,
                    expected.x,
                    xError,
                    axisType + ' tick label x position correct'
                );

                assert.close(
                    actual.y,
                    expected.y,
                    yError,
                    axisType + ' tick label y position correct'
                );
            }
        }
    });
});

/**
 * Checks that the tick labels in vertical axes are centered in their cells,
 * both vertically and horizontally. This is checked by asserting that the
 * midpoint of each tick label is the same as the midpoint between the tick it
 * belongs to, and the next one.
 *
 *                        _________
 *                        |       |
 *                        |      1|
 *                        |_______|
 *                        |       |
 *                        |2      |
 * Avoid any of these:    |_______|
 *                        |   3   |
 *                        |       |
 *                        |_______|
 *                        |       |
 *                        |       |
 *                        |___4___|
 *
 *                        _________
 *                        |       |
 *                        |   1   |
 *                        |_______|
 *                        |       |
 *                        |   2   |
 * Want this:             |_______|
 *                        |       |
 *                        |   3   |
 *                        |_______|
 *                        |       |
 *                        |   4   |
 *                        |_______|
 */
QUnit.test('Vertical axis tick labels centered', function (assert) {
    var chart,
        axes,
        xError = 1.1,
        yError = 1.4;

    chart = Highcharts.stockChart('container', {
        chart: {
            type: 'scatter'
        },
        yAxis: [{
            grid: {
                enabled: true
            },
            opposite: false
        }, {
            type: 'datetime',
            min: Date.UTC(2016, 10, 11),
            max: Date.UTC(2016, 10, 15),
            tickInterval: 1000 * 60 * 60 * 24, // Day
            grid: {
                enabled: true
            },
            opposite: false
        }, {
            grid: {
                enabled: true
            },
            opposite: true
        }, {
            grid: {
                enabled: true
            },
            type: 'datetime',
            min: Date.UTC(2016, 10, 12),
            max: Date.UTC(2016, 10, 16),
            tickInterval: 1000 * 60 * 60 * 24 * 7, // Week
            opposite: true
        }],
        series: [{
            yAxis: 0,
            data: [[29.2, 1], [271.5, 2], [376.0, 3]]
        }, {
            yAxis: 1,
            data: [{
                x: 1,
                y: Date.UTC(2016, 10, 12)
            }, {
                x: 2,
                y: Date.UTC(2016, 10, 14)
            }]
        }, {
            yAxis: 2,
            data: [[-176.0, 29.9], [-129.2, 106.4], [-71.5, 144.0]]
        }, {
            yAxis: 3,
            data: [{
                x: 1,
                y: Date.UTC(2016, 10, 13)
            }, {
                x: 2,
                y: Date.UTC(2016, 10, 15)
            }]
        }]
    });

    axes = chart.yAxis;

    Highcharts.each(axes, function (axis) {
        var axisType = axis.options.type,
            tickPositions = axis.tickPositions,
            ticks = axis.ticks,
            tick,
            nextTick,
            tickBox,
            nextTickBox,
            labelBox,
            actual,
            expected,
            i;

        if (!axisType) {
            if (axis.options.categories) {
                axisType = 'categories';
            } else {
                axisType = 'linear';
            }
        }

        for (i = 0; i < tickPositions.length; i++) {
            tick = ticks[tickPositions[i]];
            nextTick = ticks[tickPositions[i + 1]];
            if (tick.mark && tick.label && nextTick && nextTick.mark) {
                tickBox = tick.mark.element.getBBox();
                nextTickBox = nextTick.mark.element.getBBox();
                labelBox = tick.label.element.getBBox();

                expected = {
                    x: tickBox.x + (tickBox.width / 2),
                    y: (tickBox.y + nextTickBox.y) / 2
                };
                actual = {
                    x: labelBox.x + (labelBox.width / 2),
                    y: labelBox.y + (labelBox.height / 2)
                };

                assert.close(
                    actual.x,
                    expected.x,
                    xError,
                    axisType + ' tick label x position correct'
                );

                assert.close(
                    actual.y,
                    expected.y,
                    yError,
                    axisType + ' tick label y position correct'
                );
            }
        }
    });
});

/**
 * Checks that the last tick label does not pop out of its cell if there was no
 * room.
 */
QUnit.test('Last tick label does not pop out of its cell', function (assert) {
    var labelBox,
        axisBox,
        axisRight,
        axis,
        tickPositions,
        ticks,
        tick,
        chart = Highcharts.stockChart('container', {
            chart: {
                marginRight: 150
            },
            xAxis: [{
                grid: {
                    enabled: true
                },
                type: 'datetime',
                opposite: true,
                tickInterval: 1000 * 60 * 60 * 24, // Day
                labels: {
                    format: '{value:%E}',
                    style: {
                        fontSize: '15px'
                    }
                },
                min: Date.UTC(2016, 10, 21),
                max: Date.UTC(2016, 10, 30)
            }, {
                grid: {
                    enabled: true
                },
                type: 'datetime',
                opposite: true,
                tickInterval: 1000 * 60 * 60 * 24 * 7, // Week
                labels: {
                    format: '{value:Week %W}',
                    style: {
                        fontSize: '15px'
                    }
                },
                linkedTo: 0
            }],
            series: [{
                data: [[Date.UTC(2016, 10, 22), 1]]
            }]
        });

    axis = chart.xAxis[1];
    tickPositions = axis.tickPositions;
    ticks = axis.ticks;
    // Second last tick is last tick with label
    tick = ticks[tickPositions[tickPositions.length - 2]];
    labelBox = tick.label.element.getBBox();
    axisBox = axis.axisGroup.getBBox();
    axisRight = axisBox.x + axisBox.width;
    assert.ok(
        labelBox.x < axisRight,
        'Last tick label does not pop out'
    );
});

/**
 * Leftmost tick label appears even if its start is less than axis.min.
 */
QUnit.test('Leftmost ticklabel appears', function (assert) {
    var chart = Highcharts.stockChart('container', {
            xAxis: [{
                grid: {
                    enabled: true
                },
                type: 'datetime',
                opposite: true,
                tickInterval: 1000 * 60 * 60 * 24, // Day
                labels: {
                    format: '{value:%E}',
                    style: {
                        fontSize: '15px'
                    }
                },
                min: Date.UTC(2016, 10, 23),
                max: Date.UTC(2016, 10, 28)
            }, {
                grid: {
                    enabled: true
                },
                type: 'datetime',
                opposite: true,
                tickInterval: 1000 * 60 * 60 * 24 * 7, // Week
                labels: {
                    format: '{value:Week %W}',
                    style: {
                        fontSize: '15px'
                    }
                },
                linkedTo: 0
            }],
            series: [{
                data: [[Date.UTC(2016, 10, 27), 1]]
            }]
        }),
        axis = chart.xAxis[1],
        axisBox = axis.axisGroup.getBBox(),
        axisCenter = axisBox.x + (axisBox.width / 2),
        tickPositions = axis.tickPositions,
        firstTick = axis.ticks[tickPositions[0]],
        tickLabel = firstTick.label.element;

    // In a linked axis, a tick which normally would have been added even
    // though its pos is lower than axis.min, is trimmed.
    assert.ok(
        firstTick !== undefined,
        'First tick exists'
    );

    assert.equal(
        firstTick.pos,
        axis.min,
        'First tick gets pos from axis.min'
    );

    assert.close(
        +tickLabel.getAttribute('x'),
        axisCenter,
        1,
        'First tick label is centered in its grid'
    );
    assert.strictEqual(
        tickLabel.getAttribute('text-anchor'),
        'middle',
        'First tick label has text-anchor equal "middle".'
    );
});
