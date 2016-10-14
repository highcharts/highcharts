/**
 * Tests the isOuterAxis() function
 */
QUnit.test('isOuterAxis()', function (assert) {
    var chart;

    $('#container').highcharts({
        chart: {
            type: 'bar'
        },
        xAxis: [{
            title: {
                text: 'First Axis'
            },
            grid: true
        }, {
            title: {
                text: 'Second Axis'
            },
            grid: true
        }, {
            title: {
                text: 'Third Axis'
            },
            grid: true,
            opposite: true
        }, {
            title: {
                text: 'Fourth Axis'
            },
            grid: true,
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

    chart = $('#container').highcharts();

    assert.ok(
        chart.xAxis[1].isOuterAxis(),
        'Lowermost bottom x-axis is outerAxis'
    );

    assert.notOk(
        chart.xAxis[2].isOuterAxis(),
        'Lowermost top x-axis is not outerAxis'
    );

    assert.ok(
        chart.xAxis[3].isOuterAxis(),
        'Topmost top x-axis is outerAxis'
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
    $('#container').highcharts({
        chart: {
            type: 'line'
        },
        yAxis: [{
            title: {
                text: 'First Axis'
            },
            grid: true,
            id: 'axis1'
        }, {
            title: {
                text: 'Second Axis'
            },
            grid: true,
            id: 'axis2'
        }, {
            title: {
                text: 'Third Axis'
            },
            grid: true,
            opposite: true,
            linkedTo: 0,
            id: 'axis3'
        }, {
            title: {
                text: 'Fourth Axis'
            },
            grid: true,
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

    chart = $('#container').highcharts();
    axes[0] = chart.yAxis[0].axisGroup.getBBox();
    axes[1] = chart.yAxis[1].axisGroup.getBBox();
    axes[2] = chart.yAxis[2].axisGroup.getBBox();
    axes[3] = chart.yAxis[3].axisGroup.getBBox();

    error = 0.00001;

    assert.close(
        axes[1].x + axes[1].width,
        axes[0].x,
        error,
        'Left outer linear axis horizontal placement'
    );

    assert.close(
        axes[3].x,
        axes[2].x + axes[2].width,
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

    $('#container').highcharts({
        title: {
            type: 'scatter'
        },
        yAxis: [{
            title: {
                text: 'First Axis'
            },
            grid: true,
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
            title: {
                text: 'Second Axis'
            },
            grid: true,
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
            title: {
                text: 'Third Axis'
            },
            grid: true,
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
            title: {
                text: 'Fourth Axis'
            },
            grid: true,
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

    chart = $('#container').highcharts();
    axes[0] = chart.yAxis[0].axisGroup.getBBox();
    axes[1] = chart.yAxis[1].axisGroup.getBBox();
    axes[2] = chart.yAxis[2].axisGroup.getBBox();
    axes[3] = chart.yAxis[3].axisGroup.getBBox();

    error = 0.00001;

    assert.close(
        axes[1].x + axes[1].width,
        axes[0].x,
        error,
        'Left outer datetime axis horizontal placement'
    );

    assert.close(
        axes[3].x,
        axes[2].x + axes[2].width,
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
    $('#container').highcharts({
        chart: {
            type: 'line'
        },
        xAxis: [{
            title: {
                text: 'First Axis'
            },
            grid: true,
            id: 'axis1'
        }, {
            title: {
                text: 'Second Axis'
            },
            grid: true,
            id: 'axis2'
        }, {
            title: {
                text: 'Third Axis'
            },
            grid: true,
            opposite: true,
            linkedTo: 0,
            id: 'axis3'
        }, {
            title: {
                text: 'Fourth Axis'
            },
            grid: true,
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

    chart = $('#container').highcharts();
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

    $('#container').highcharts({
        title: {
            type: 'scatter'
        },
        xAxis: [{
            title: {
                text: 'First Axis'
            },
            grid: true,
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
            title: {
                text: 'Second Axis'
            },
            grid: true,
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
            title: {
                text: 'Third Axis'
            },
            grid: true,
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
            title: {
                text: 'Fourth Axis'
            },
            grid: true,
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

    chart = $('#container').highcharts();
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
 * Checks that datetime and linear axes have ticks placed at the start and end
 * of the axis, creating a grid:
 *   ___________________
 *   |__|__|__|__|__|__|
 *   ^                 ^
 */
QUnit.test('Horizontal axis ticks at start and end', function (assert) {
    var chart,
        axes,
        axis,
        $axisGroup,
        axisGroupBox,
        leftTick,
        rightTick,
        ticks,
        i;

    chart = Highcharts.chart('container', {
        chart: {
            type: 'scatter'
        },
        xAxis: [{
            title: {
                text: 'First Axis'
            },
            grid: true
        }, {
            title: {
                text: 'Second Axis'
            },
            type: 'datetime',
            grid: true
        }, {
            title: {
                text: 'Third Axis'
            },
            grid: true,
            opposite: true
        }, {
            title: {
                text: 'Fourth Axis'
            },
            grid: true,
            type: 'datetime',
            opposite: true
        }],
        series: [{
            xAxis: 0,
            data: [[129.9, 271.5], [306.4, -29.2], [544.0, 376.0]]
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

    axes = chart.xAxis;

    for (i = 0; i < axes.length; i++) {
        axis = axes[0];
        $axisGroup = $(axis.axisGroup.element);
        axisGroupBox = $axisGroup[0].getBBox();
        ticks = $axisGroup.children();
        leftTick = ticks[0];
        rightTick = ticks.slice(-1)[0];

        assert.equal(
            leftTick.getBBox().x,
            axisGroupBox.x,
            'Leftmost tick has same x value as leftmost point of axisGroup'
        );

        assert.equal(
            rightTick.getBBox().x,
            axisGroupBox.x + axisGroupBox.width,
            'Rightmost tick has same x value as rightmost point of axisGroup'
        );
    }
});

/**
 * Checks that the ticks in independent horizontal axes are equally distributed,
 * by checking that the space between the first and second tick is equal to the
 * second last and last tick.
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
        error = 0.5000000001,
        ticks,
        $axisGroup,
        axisGroupBox,
        secondLeftmostTick,
        rightmostTick,
        axisLeftPoint,
        axisRightPoint,
        leftSpace,
        rightSpace;

    chart = Highcharts.chart('container', {
        chart: {
            type: 'scatter'
        },
        xAxis: [{
            title: {
                text: 'First Axis'
            },
            grid: true
        }, {
            title: {
                text: 'Second Axis'
            },
            type: 'datetime',
            grid: true
        }, {
            title: {
                text: 'Third Axis'
            },
            grid: true,
            opposite: true
        }, {
            title: {
                text: 'Fourth Axis'
            },
            grid: true,
            type: 'datetime',
            opposite: true
        }],
        series: [{
            xAxis: 0,
            data: [[129.9, 271.5], [306.4, -29.2], [544.0, 376.0]]
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

    axes = chart.xAxis;

    for (i = 0; i < axes.length; i++) {
        axis = axes[i];
        $axisGroup = $(axis.axisGroup.element);
        ticks = $axisGroup.find('.highcharts-tick');
        secondLeftmostTick = ticks[1];
        rightmostTick = ticks.slice(-2)[0];
        axisGroupBox = $axisGroup[0].getBBox();
        axisLeftPoint = axisGroupBox.x;
        axisRightPoint = axisGroupBox.x + axisGroupBox.width;
        leftSpace = secondLeftmostTick.getBBox().x - axisLeftPoint;
        rightSpace = axisRightPoint - rightmostTick.getBBox().x;

        assert.close(
            leftSpace,
            rightSpace,
            error,
            'Left space is equal to right space in xAxis[' + i + ']'
        );
    }
});
