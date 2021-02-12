QUnit.test(
    'Tooltip positioned correctly through the getPosition function.',
    function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                width: 400,
                height: 400
            },

            xAxis: {
                type: 'category'
            },
            tooltip: {
                animation: false,
                pointFormat:
                    'aaa aaa aaa aaa<br/> ' +
                    'aaa aaa aaa aaa<br/> aaa aaa ' +
                    'aaa aaa<br/> aaa aaa aaa aaa<br/> ' +
                    'aaa aaa aaa aaa<br/> aaa aaa ' +
                    'aaa aaa<br/> aaa aaa aaa aaa<br/> ' +
                    'aaa aaa aaa aaa<br/> aaa aaa ' +
                    'aaa aaa<br/> aaa aaa aaa aaa<br/> ' +
                    'aaa aaa aaa aaa<br/> aaa aaa ' +
                    'aaa aaa<br/> aaa aaa aaa aaa<br/> ' +
                    'aaa aaa aaa aaa<br/> aaa aaa ' +
                    'aaa aaa<br/> aaa aaa aaa aaa '
            },
            series: [
                {
                    type: 'column',
                    data: [2, 3, 5, 2, 5, 2]
                }, {
                    type: 'line',
                    data: [1, 2, 3]
                }
            ]
        });

        chart.tooltip.refresh(chart.series[0].points[0]);

        assert.strictEqual(
            chart.tooltip.now.anchorY,
            Math.round(chart.series[0].points[0].plotY) + chart.plotTop,
            'Tooltip points to the middle of the top side of fist column (#7242)'
        );

        chart.series[0].setData([-2, -3, -5, -2, -5, -2]);

        chart.tooltip.refresh(chart.series[0].points[5]);

        assert.strictEqual(
            chart.tooltip.now.anchorY,
            Math.round(chart.series[0].points[5].plotY) + chart.plotTop,
            'Tooltip points to the middle of the top side of last column (#7242)'
        );

        // Add one point
        const x = chart.tooltip.label.translateX;
        chart.series[0].points[5].onMouseOver();

        chart.series[0].addPoint({
            x: 6,
            y: 1
        });
        assert.notEqual(
            chart.tooltip.label.translateX,
            x,
            'The tooltip should move with its point'
        );

        chart.tooltip.refresh(chart.series[1].points[0]);
        const distanceBefore = chart.tooltip.now.x - chart.tooltip.now.anchorX;

        chart.renderTo.style.transform = 'scale(1.5)';
        chart.reflow();

        chart.tooltip.refresh(chart.series[1].points[0]);
        assert.strictEqual(
            chart.tooltip.now.x - chart.tooltip.now.anchorX,
            distanceBefore,
            '#12031: Distance should be the same before and after scaling'
        );

        chart.renderTo.style.transform = '';
    }
);
// Highcharts v4.0.3, Issue #424
// Tooltip is positioned on the top series if multiple y axis is used.
QUnit.test('Wrong tooltip pos for column (#424)', function (assert) {
    var chart = Highcharts.chart('container', {
        yAxis: [
            {
                height: '40%'
            },
            {
                top: '50%',
                height: '50%',
                offset: 0
            }
        ],
        tooltip: {
            hideDelay: 0
        },
        series: [
            {
                data: [1]
            },
            {
                data: [5],
                yAxis: 1,
                type: 'column'
            }
        ]
    });

    var controller = new TestController(chart),
        tooltipYPos = 0,
        linePoint = chart.series[0].points[0],
        lineXPos = linePoint.plotX,
        lineYPos = linePoint.plotY,
        columnPoint = chart.series[1].points[0],
        columnXPos = columnPoint.plotX,
        columnYPos = chart.series[1].group.translateY + columnPoint.plotY,
        series,
        offsetTop,
        point0,
        point1,
        barSpace;

    controller.moveTo(lineXPos + 1, lineYPos + 1);
    assert.ok(!chart.tooltip.isHidden, 'Tooltip should be visible.');
    tooltipYPos = chart.tooltip.label.translateY;
    assert.ok(
        tooltipYPos < lineYPos,
        'Tooltip of first series should be over first series'
    );
    controller.moveTo(0, 0);
    assert.ok(chart.tooltip.isHidden, 'Tooltip should be hidden.');
    controller.moveTo(columnXPos + 1, columnYPos + 1);
    assert.ok(!chart.tooltip.isHidden, 'Tooltip should be visible.');
    tooltipYPos = chart.tooltip.label.translateY;
    assert.ok(
        tooltipYPos < columnYPos && tooltipYPos > lineYPos,
        'Tooltip of second series should be over second series, but under first series'
    );

    chart = Highcharts.chart('container', {
        chart: {
            type: 'bar',
            width: 600
        },
        xAxis: {
            height: '31%',
            top: '19%',
            startOnTick: true,
            min: 0
        },
        series: [
            {
                data: [5, 3, 4, 7, 2]
            }
        ]
    });

    controller = new TestController(chart);
    series = chart.series[0];
    offsetTop = Highcharts.relativeLength(
        chart.xAxis[0].options.top,
        chart.plotHeight
    );
    point0 = chart.series[0].points[0];
    point1 = chart.series[0].points[1];
    barSpace =
        Math.abs(series.points[1].plotX - series.points[0].plotX) -
        point0.shapeArgs.width;
    tooltipYPos =
        offsetTop +
        chart.plotTop +
        point0.shapeArgs.width +
        (barSpace * 3) / 2 +
        point1.shapeArgs.width / 2;

    controller.moveTo(chart.plotLeft + 1, tooltipYPos);
    assert.close(
        chart.tooltip.now.anchorY,
        Math.round(tooltipYPos),
        1.1,
        'Tooltip position should be correct when bar chart xAxis has top and height set with percent values (#12589).'
    );

    chart.update({
        xAxis: {
            height: 128,
            top: 73
        }
    });

    offsetTop = chart.xAxis[0].options.top - chart.plotTop;
    barSpace =
        Math.abs(series.points[1].plotX - series.points[0].plotX) -
        point0.shapeArgs.width;
    tooltipYPos =
        offsetTop +
        chart.plotTop +
        point0.shapeArgs.width +
        (barSpace * 3) / 2 +
        point1.shapeArgs.width / 2;

    controller.moveTo(chart.plotLeft + 1, tooltipYPos);
    assert.close(
        chart.tooltip.now.anchorY,
        Math.round(tooltipYPos),
        1.1,
        'Tooltip position should be correct when bar chart xAxis has top and height set with numeric values (#12589).'
    );
});

QUnit.test('Tooltip position with multiple axes.', assert => {
    const chart = Highcharts.chart('container', {
        xAxis: [
            {
                width: '50%'
            },
            {
                left: '50%',
                width: '50%',
                offset: 0
            }
        ],
        plotOptions: {
            series: {
                grouping: false
            }
        },
        series: [
            {
                type: 'column',
                xAxis: 0,
                data: [
                    {
                        y: 120000
                    },
                    {
                        y: 569000
                    },
                    {
                        y: 231000
                    }
                ]
            },
            {
                type: 'column',
                xAxis: 1,
                data: [
                    {
                        y: 10000
                    },
                    {
                        y: 500000
                    },
                    {
                        y: 201000
                    }
                ]
            }
        ]
    });

    const point = chart.series[1].points[0];
    const axis = point.series.xAxis;

    assert.ok(
        axis.left - chart.plotLeft < point.tooltipPos[0],
        'Tooltip x position should be within correct xAxis (#14244).'
    );
});

QUnit.test('Tooltip position with inverted multiple axes', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            inverted: true
        },
        yAxis: [{
            width: '45%'
        }, {
            width: '45%',
            left: '55%',
            offset: 0
        }],
        tooltip: {
            shared: false
        },
        series: [{
            data: [1, -4, 3, -5],
            yAxis: 0
        }, {
            data: [2, -2, 1, -3],
            yAxis: 0
        }, {
            data: [1, -4, 3, -5],
            yAxis: 1
        }]
    });

    const point1 = chart.series[0].points[1];

    point1.onMouseOver();
    assert.close(
        chart.tooltip.now.anchorX,
        chart.series[0].yAxis.width + chart.plotLeft - point1.plotY,
        0.5,
        'Tooltip position on inverted chart with multiple axes should appear at point (#14771).'
    );
});
