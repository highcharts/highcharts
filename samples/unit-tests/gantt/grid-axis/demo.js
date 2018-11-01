/**
 * Tests the isOuterAxis() function
 */
QUnit.test('isOuterAxis()', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'bar'
        },
        xAxis: [{
            grid: {
                enabled: true
            }
        }, {
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
        axes = [];

    // Chart 1
    chart = Highcharts.chart('container', {
        chart: {
            type: 'line'
        },
        yAxis: [{
            grid: {
                enabled: true
            },
            id: 'axis1'
        }, {
            grid: {
                enabled: true
            },
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

    assert.close(
        axes[1].x + axes[1].width,
        axes[0].x,
        0.1,
        'Left outer linear axis horizontal placement'
    );

    assert.strictEqual(
        axes[3].x,
        axes[2].x + axes[2].width,
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

    chart = Highcharts.chart('container', {
        title: {
            type: 'scatter'
        },
        yAxis: [{
            grid: {
                enabled: true
            },
            id: 'axis1',
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
    chart = Highcharts.chart('container', {
        chart: {
            type: 'line'
        },
        xAxis: [{
            grid: {
                enabled: true
            },
            id: 'axis1'
        }, {
            grid: {
                enabled: true
            },
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

    chart = Highcharts.chart('container', {
        title: {
            type: 'scatter'
        },
        xAxis: [{
            grid: {
                enabled: true
            },
            id: 'axis1',
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
 * Checks that datetime and linear axes for each series type (except 'pie')have
 * ticks placed at the start and end of the axis, creating a grid:
 *   ___________________
 *   |__|__|__|__|__|__|
 *   ^                 ^
 */
QUnit.test('Horizontal axis ticks at start and end', function (assert) {
    var chart,
        types = ['line', 'column', 'bar', 'bubble'];

    chart = Highcharts.chart('container', {
        chart: {
            type: 'line'
        },
        xAxis: [{
            type: 'datetime',
            grid: {
                enabled: true
            }
        }, {
            type: 'datetime',
            grid: {
                enabled: true
            },
            linkedTo: 0
        }, {
            grid: {
                enabled: true
            },
            opposite: true
        }, {
            grid: {
                enabled: true
            },
            opposite: true,
            linkedTo: 2
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
                x: Date.UTC(2016, 10, 13),
                y: 1
            }, {
                x: Date.UTC(2016, 10, 15),
                y: 2
            }]
        }, {
            xAxis: 2,
            data: [129.9, 306.4, 544.0]
        }, {
            xAxis: 3,
            data: [-144.0, -106.4, 29.9]
        }]
    });

    types.forEach(function (type) {
        var axes,
            axis,
            $axisGroup,
            axisGroupBox,
            leftTick,
            rightTick,
            ticks,
            i;

        chart.options.chart.type = type;
        chart = Highcharts.chart('container', chart.options);

        axes = chart.xAxis;
        for (i = 0; i < axes.length; i++) {
            axis = axes[0];
            $axisGroup = $(axis.axisGroup.element);
            axisGroupBox = $axisGroup[0].getBBox();
            ticks = $axisGroup.find('.highcharts-tick');
            leftTick = ticks[0].getBBox();
            rightTick = ticks.slice(-1)[0].getBBox();

            assert.equal(
                leftTick.x,
                axisGroupBox.x,
                type + ' chart, ' + axis.coll + ', leftmost tick is placed correctly'
            );

            assert.equal(
                type === 'bar' ? rightTick.x + rightTick.width : rightTick.x,
                axisGroupBox.x + axisGroupBox.width,
                type + ' chart, ' + axis.coll + ', rightmost tick is placed correctly'
            );
        }
    });
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
        error = 1.1,
        ticks,
        $axisGroup,
        axisGroupBox,
        secondLeftmostTick,
        secondRightmostTick,
        axisLeftPoint,
        axisRightPoint,
        leftSpace,
        rightSpace;

    chart = Highcharts.chart('container', {
        chart: {
            type: 'scatter'
        },
        xAxis: [{
            grid: {
                enabled: true
            }
        }, {
            grid: {
                enabled: true
            },
            linkedTo: 0
        }, {
            grid: {
                enabled: true
            },
            type: 'datetime',
            opposite: true
        }, {
            grid: {
                enabled: true
            },
            type: 'datetime',
            opposite: true,
            linkedTo: 2
        }],
        series: [{
            xAxis: 0,
            data: [[1, 271.5], [2, -29.2], [3, 376.0]]
        }, {
            xAxis: 1,
            data: [[29.9, -71.5], [-106.4, -129.2], [-144.0, -176.0]]
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

    for (i = 0; i < axes.length; i++) {
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
 * Want this:             |   1   |   2   |   3   |   4   |
 *                        |_______|_______|_______|_______|
 */
QUnit.test('Horizontal axis tick labels centered', function (assert) {
    var chart,
        axes,
        xError = 1.5,
        yError = 1.1;

    chart = Highcharts.chart('container', {
        chart: {
            type: 'scatter',
            width: 800
        },
        xAxis: [{
            grid: {
                enabled: true
            }
        }, {
            type: 'datetime',
            min: Date.UTC(2016, 10, 11),
            max: Date.UTC(2016, 10, 15),
            tickInterval: 1000 * 60 * 60 * 24, // Day
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
            type: 'datetime',
            min: Date.UTC(2016, 10, 12),
            max: Date.UTC(2016, 10, 16),
            tickInterval: 1000 * 60 * 60 * 24 * 7, // Week
            opposite: true
        }],
        series: [{
            xAxis: 0,
            data: [[1, 271.5], [2, -29.2], [3, 376.0]]
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
            data: [[29.9, -71.5], [-106.4, -129.2], [-144.0, -176.0]]
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

        for (i = 1; i < tickPositions.length - 1; i++) {
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
                    axisType + ' tick label x position correct ' + tick.label.textStr
                );

                assert.close(
                    actual.y,
                    expected.y,
                    yError,
                    axisType + ' tick label y position correct ' + tick.label.textStr
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

    chart = Highcharts.chart('container', {
        chart: {
            type: 'scatter'
        },
        yAxis: [{
            grid: {
                enabled: true
            }
        }, {
            type: 'datetime',
            min: Date.UTC(2016, 10, 11),
            max: Date.UTC(2016, 10, 15),
            tickInterval: 1000 * 60 * 60 * 24, // Day
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
            type: 'datetime',
            min: Date.UTC(2016, 10, 12),
            max: Date.UTC(2016, 10, 16),
            tickInterval: 1000 * 60 * 60 * 24 * 7, // Week
            opposite: true
        }],
        series: [{
            yAxis: 0,
            data: [[271.5, 1], [-29.2, 2], [376.0, 3]]
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
            data: [[-71.5, 29.9], [-129.2, -106.4], [-176.0, -144.0]]
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

QUnit.module('labels alignment', function () {
    var each = Highcharts.each,
        map = Highcharts.map,
        categories = ['Category 1', 'Category 2', 'Category 3'],
        optionsAxis = {
            type: 'category',
            grid: {
                enabled: true
            },
            labels: {
                useHTML: false
            },
            min: 0,
            max: categories.length - 1,
            categories: categories
        },
        chart,
        getTestFunction,
        getCellCenter,
        getBBox;


    getBBox = function (container, element) {
        var containerRect = container.getBoundingClientRect(),
            rect = element.getBoundingClientRect();
        return {
            x: rect.left - containerRect.left,
            y: rect.top - containerRect.top,
            width: rect.width,
            height: rect.height
        };
    };

    getCellCenter = function (coll, bboxLastTickMark, bboxTickMark) {
        var left, right, top, bottom;

        if (coll === 'xAxis') {
            left = bboxLastTickMark.x;
            top = bboxLastTickMark.y;
            bottom = bboxLastTickMark.y + bboxLastTickMark.height;
            right = bboxTickMark.x;
        } else {
            left = bboxTickMark.x;
            top = bboxTickMark.y;
            bottom = bboxLastTickMark.y;
            right = bboxTickMark.x + bboxTickMark.width;
        }

        return [
            left + ((right - left) / 2),
            top + ((bottom - top) / 2)
        ];
    };

    getTestFunction = function (assert) {
        return function (axis, pos) {
            var container = axis.chart.container,
                tick = axis.ticks[pos],
                leftTick = axis.ticks[pos - 1],
                center = getCellCenter(
                    axis.coll,
                    getBBox(container, leftTick.mark.element),
                    getBBox(container, tick.mark.element)
                ),
                bboxLabel = getBBox(container, tick.label.element),

                // Firefox/Mac needs 2.3 in order to pass, Edge needs 1.5,
                // others 1.1.
                precision = 2.3;

            assert.close(
                bboxLabel.x,
                center[0] - (bboxLabel.width / 2),
                precision,
                axis.coll + ' label "' + tick.label.textStr + '" is centered horizontally.'
            );

            assert.close(
                bboxLabel.y,
                center[1] - (bboxLabel.height / 2),
                precision,
                axis.coll + ' label "' + tick.label.textStr + '" is centered vertically.'
            );
        };
    };

    QUnit.test('useHtml: false', function (assert) {
        var testTickPosition = getTestFunction(assert);

        /**
         * Test label positions on the x and yAxis with a single line.
         * NOTE: options and chart must be set again, due to tests running async.
         */
        optionsAxis.labels.useHTML = false;
        optionsAxis.categories = categories;
        chart = Highcharts.chart('container', {
            series: [{}],
            xAxis: optionsAxis,
            yAxis: optionsAxis
        });

        each(chart.axes, function (axis) {
            each(axis.tickPositions, function (pos) {
                testTickPosition(axis, pos);
            });
        });

        /**
         * Test label positions on the x and yAxis with a second line.
         */
        optionsAxis.categories = map(categories, function (str) {
            return str + '<br/>Second Line';
        });

        chart.update({
            xAxis: optionsAxis,
            yAxis: optionsAxis
        });

        each(chart.axes, function (axis) {
            each(axis.tickPositions, function (pos) {
                testTickPosition(axis, pos);
            });
        });
    });

    QUnit.test('useHtml: true', function (assert) {
        var testTickPosition = getTestFunction(assert);

        /**
         * Test label positions on the x and yAxis with a single line.
         * NOTE: options and chart must be set again, due to tests running async.
         */
        optionsAxis.categories = map(categories, function (str) {
            return '<span>' + str + '<span>';
        });
        optionsAxis.labels.useHTML = true;

        chart = Highcharts.chart('container', {
            series: [{}],
            xAxis: optionsAxis,
            yAxis: optionsAxis
        });
        each(chart.axes, function (axis) {
            each(axis.tickPositions, function (pos) {
                testTickPosition(axis, pos);
            });
        });

        /**
         * Test label positions on the x and yAxis with a second line.
         */
        optionsAxis.categories = map(categories, function (str) {
            return '<span>' + str + '</span><br/><span>Second Line</span>';
        });

        chart.update({
            xAxis: optionsAxis,
            yAxis: optionsAxis
        });

        each(chart.axes, function (axis) {
            each(axis.tickPositions, function (pos) {
                testTickPosition(axis, pos);
            });
        });
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
        chart = Highcharts.chart('container', {
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
    var chart = Highcharts.chart('container', {
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
        tickPositions = axis.tickPositions,
        firstTick = axis.ticks[tickPositions[0]],
        axisBox = axis.axisGroup.getBBox(),
        axisCenter = axisBox.x + (axisBox.width / 2),
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

QUnit.test('Reversed axis', function (assert) {
    var chart = Highcharts.chart('container', {
            xAxis: {
                reversed: true,
                grid: {
                    enabled: true
                },
                tickPixelInterval: 100
            },
            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
                type: 'column'
            }]
        }),
        axis = chart.xAxis[0],
        ticks = axis.ticks,
        tickLabel = ticks[10].label,
        rightBorder = ticks[10].mark.element.getBBox(),
        leftBorder = ticks[11].mark.element.getBBox(),
        center = leftBorder.x + ((rightBorder.x - leftBorder.x) / 2);

    // TODO: extend test to check all tick labels
    // #6754
    assert.strictEqual(
        +tickLabel.element.getAttribute('x'),
        center,
        'Last tick label is centered in its grid'
    );
});


QUnit.test('defaultOptions.borderWidth', function (assert) {
    var createGridAxis = function () {
            var obj = function () {};
            // Copy values from Axis.
            obj.prototype = Highcharts.Axis.prototype;
            return new obj();
        },
        axis = createGridAxis(),
        options;

    // Set side to top
    axis.side = 0;
    // Several cases where there is no check if chart exists
    axis.chart = {};


    /**
     * grid.borderWidth should default to 1
     */
    axis.setOptions({
        grid: {
            enabled: true
        }
    });
    options = axis.options;

    assert.strictEqual(
        options.grid.borderWidth,
        1,
        'should default to 1 when grid.enabled is true.'
    );

    assert.strictEqual(
        options.lineWidth,
        1,
        'should set the value of grid.borderWidth on lineWidth.'
    );

    assert.strictEqual(
        options.tickWidth,
        1,
        'should set the value of grid.borderWidth on tickWidth.'
    );

    /**
     * grid.borderWidth should override tickWidth and lineWidth
     */
    axis.setOptions({
        grid: {
            enabled: true
        },
        tickWidth: 2,
        lineWidth: 2
    });
    options = axis.options;

    assert.strictEqual(
        options.lineWidth,
        1,
        'borderWidth should override lineWidth.'
    );

    assert.strictEqual(
        options.tickWidth,
        1,
        'borderWidth should override tickWidth.'
    );

    /**
     * should use value from lineWidth/tickWidth when borderWidth is not a
     * number.
     */
    axis.setOptions({
        grid: {
            enabled: true,
            borderWidth: null
        },
        tickWidth: 2,
        lineWidth: 2
    });
    options = axis.options;

    assert.strictEqual(
        options.lineWidth,
        2,
        'should use value from lineWidth when borderWidth is not a number.'
    );

    assert.strictEqual(
        options.tickWidth,
        2,
        'should use value from tickWidth when borderWidth is not a number.'
    );
});

QUnit.test('startOnTick and endOnTick', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 800
        },
        xAxis: {
            grid: {
                enabled: true
            },
            tickInterval: 24 * 36e5,
            startOnTick: true,
            endOnTick: true,
            type: 'datetime'
        },
        series: [{
            data: [{
                x: Date.UTC(2018, 8, 17, 16),
                y: 1
            }, {
                x: Date.UTC(2018, 8, 21, 8),
                y: 2
            }]
        }]
    });

    assert.strictEqual(
        Highcharts.dateFormat(null, chart.xAxis[0].min),
        Highcharts.dateFormat(null, Date.UTC(2018, 8, 17, 0)),
        'Start on tick, the first tick should be midnight'
    );

    assert.strictEqual(
        Highcharts.dateFormat(null, chart.xAxis[0].max),
        Highcharts.dateFormat(null, Date.UTC(2018, 8, 22, 0)),
        'Start on tick, the last tick should be midnight'
    );
});