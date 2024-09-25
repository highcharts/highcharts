/* eslint-disable max-len */
QUnit.test('X-Range', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'xrange'
        },
        title: {
            text: 'Highcharts X-range'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: '',
            categories: ['Prototyping', 'Development', 'Testing']
        }
    });

    assert.notEqual(typeof chart.yAxis[0].max, 'number', 'Axis empty');

    chart.addSeries({
        name: 'Project 1',
        borderRadius: 5,
        data: [
            {
                x: Date.UTC(2014, 11, 1),
                x2: Date.UTC(2014, 11, 2),
                y: 0,
                colorIndex: 9
            },
            {
                x: Date.UTC(2014, 11, 2),
                x2: Date.UTC(2014, 11, 5),
                y: 1
            },
            {
                x: Date.UTC(2014, 11, 8),
                x2: Date.UTC(2014, 11, 9),
                y: 2
            },
            {
                x: Date.UTC(2014, 11, 9),
                x2: Date.UTC(2014, 11, 19),
                y: 1
            },
            {
                x: Date.UTC(2014, 11, 10),
                x2: Date.UTC(2014, 11, 23),
                y: 2
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].points[0].colorIndex,
        9,
        'The point colorIndex option should be applied'
    );

    assert.strictEqual(chart.yAxis[0].max, 2, 'Axis added');

    var series = chart.series[0];
    series.addPoint({
        x: Date.UTC(2014, 11, 23),
        x2: Date.UTC(2014, 11, 30),
        y: 3
    });
    chart.yAxis[0].setCategories([
        'Prototyping',
        'Development',
        'Testing',
        'Resting'
    ]);

    assert.strictEqual(series.points.length, 6, 'Now six points');

    series.points[5].update({
        partialFill: 0.5
    });

    assert.strictEqual(series.points[5].partialFill, 0.5, 'Partial fill set');

    series.update({
        states: {
            hover: {
                color: '#ff0000',
                borderWidth: 4,
                borderColor: '#00ff00',
                animation: {
                    duration: 0
                }
            }
        }
    });

    series.points[5].setState('hover');

    assert.strictEqual(
        series.points[5].graphic.rect.attr('fill'),
        '#ff0000',
        'Hover color of graphicOriginal is correct (#9880).'
    );

    assert.strictEqual(
        series.points[5].graphic.partRect.attr('fill').replace(/ /g, ''),
        'rgb(179,0,0)',
        'Hover color of graphicOverlay (#9880).'
    );

    series.points[0].remove();
    assert.strictEqual(series.points.length, 5, 'Now five points');

    series.remove();
    assert.strictEqual(chart.series.length, 0, 'No series left');

    // #7617
    chart.addSeries(
        {
            pointWidth: 20,
            data: [
                {
                    x: 1,
                    x2: 9,
                    y: 0,
                    partialFill: 0.25
                }
            ]
        },
        false
    );
    chart.xAxis[0].setExtremes(2, null);

    var point = chart.series[0].points[0],
        clipRect = point.graphic.partialClipRect;
    assert.close(
        Math.floor(
            chart.xAxis[0].toValue(clipRect.attr('width') - clipRect.attr('x'))
        ),
        (point.x2 - point.x) * point.partialFill,
        1,
        'Clip rect ends at correct position after zoom (#7617).'
    );

    point.select();
    assert.strictEqual(
        point.graphic.rect.attr('fill'),
        point.series.options.states.select.color,
        'Correct fill for a point upon point selection (#8104).'
    );

    chart.xAxis[0].update(
        {
            min: 0,
            max: 1000,
            reversed: true
        },
        false
    );
    chart.series[0].update({
        minPointLength: 10,
        borderWidth: 0,
        data: [
            {
                x: 45,
                x2: 45.1,
                y: 1
            },
            {
                x: 5,
                x2: 45,
                y: 0
            }
        ]
    });

    assert.strictEqual(
        Math.round(chart.series[0].points[0].graphic.getBBox().width),
        10,
        'Correct width for minPointLength on a reversed xAxis (#8933).'
    );

    assert.ok(
        chart.series[0].points[1].graphic.getBBox().width > 10,
        'Longer points unaffected by minPointWidth on a reversed xAxis (#8933).'
    );

    chart.series[0].update({
        pointPlacement: 0.5
    });

    point = chart.series[0].points[1];
    assert.close(
        point.graphic.rect.attr('y') + point.graphic.rect.getBBox().height / 2,
        chart.plotHeight,
        1,
        'The point should now be on the center of the plot area'
    );

    chart = Highcharts.chart('container', {
        chart: {
            type: 'xrange',
            plotBorderWidth: 1,
            plotBorderColor: 'red',
            borderColor: 'red',
            borderWidth: 1
        },
        title: {
            text: ''
        },
        plotOptions: {
            series: {
                dragDrop: {
                    draggableX: true,
                    dragHandle: {
                        cursor: 'grab'
                    }
                }
            }
        },
        yAxis: {
            min: 0,
            max: 1,
            categories: ['Prototyping', 'Development']
        },
        series: [
            {
                data: [
                    {
                        x: 2,
                        x2: 5,
                        y: 0
                    },
                    {
                        x: 2,
                        x2: 5,
                        y: 1
                    }
                ]
            },
            {
                data: [
                    {
                        x: 3,
                        x2: 6,
                        y: 0
                    }
                ]
            },
            {
                data: [
                    {
                        x: 2.5,
                        x2: 6,
                        y: 0
                    }
                ]
            }
        ]
    });

    point = chart.series[0].points[0];
    point.showDragHandles();
    var leftHandleBBox = chart.dragHandles.draggableX1.getBBox(),
        rightHandleBBox = chart.dragHandles.draggableX2.getBBox(),
        leftHandleX = chart.dragHandles.draggableX1.translateX,
        leftHandleY =
            chart.dragHandles.draggableX1.translateY +
            leftHandleBBox.y +
            leftHandleBBox.height / 2,
        rightHandleX = chart.dragHandles.draggableX2.translateX,
        rightHandleY =
            chart.dragHandles.draggableX2.translateY +
            rightHandleBBox.y +
            rightHandleBBox.height / 2,
        plotX = point.plotX,
        plotY =
            point.plotY +
            point.series.columnMetrics.offset +
            point.series.columnMetrics.width / 2,
        result = false;

    if (
        Math.abs(leftHandleX - plotX) <= 1 &&
        Math.abs(leftHandleY - plotY) <= 1 &&
        Math.abs(rightHandleX - point.shapeArgs.width - plotX) <= 1 &&
        Math.abs(rightHandleY - plotY) <= 1
    ) {
        result = true;
    }

    assert.ok(result, 'Drag handles should be in correct positions (#12872).');

    assert.strictEqual(
        document.querySelector(
            '.highcharts-drag-handle'
        ).attributes.cursor.value,
        'grab',
        '#16470: DragHandle cursor should use general options.'
    );
});

QUnit.test('Partial fill reversed', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'xrange'
        },
        xAxis: {
            type: 'datetime'
        },
        series: [
            {
                data: [
                    {
                        x: Date.UTC(2019, 0, 1),
                        x2: Date.UTC(2019, 0, 2),
                        y: 1,
                        partialFill: 0.5
                    }
                ]
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].points[0].graphic.rect.attr('x'),
        chart.series[0].points[0].graphic.partialClipRect.attr('x'),
        'Partial fill should be aligned left'
    );

    chart.xAxis[0].update({
        reversed: true
    });

    assert.close(
        chart.series[0].points[0].graphic.rect.attr('x') +
        chart.series[0].points[0].graphic.rect.attr('width'),
        chart.series[0].points[0].graphic.partialClipRect.attr('x') +
        chart.series[0].points[0].graphic.partialClipRect.attr('width'),
        1,
        'Partial fill should be aligned left'
    );
});

QUnit.test('X-range data labels', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            zoomType: 'x',
            width: 600
        },
        xAxis: [
            {
                minRange: 1
            }
        ],
        series: [
            {
                type: 'xrange',
                dataLabels: {
                    enabled: true
                },
                data: [
                    {
                        y: 0,
                        x: 0,
                        x2: 2,
                        color: '#8CCAF4',
                        label: 'first',
                        partialFill: 0.28
                    },
                    {
                        y: 0,
                        x: 2,
                        x2: 4,
                        color: '#F4C986',
                        label: 'second'
                    },
                    {
                        y: 0,
                        x: 4,
                        x2: 5,
                        color: '#AA45FC',
                        label: 'third'
                    },
                    {
                        y: 0,
                        x: 5,
                        x2: 7,
                        color: '#FCC9FF',
                        label: 'fourth'
                    }
                ]
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].points[0].dataLabel.text.textStr,
        '28%',
        'Correctly rounded value using default formatter (#9291)'
    );

    chart.series[0].update({
        dataLabels: {
            format: '{point.label}'
        }
    });

    var visible = 'inherit';
    var hidden = 'hidden';

    assert.deepEqual(
        chart.series[0].points
            .map(function (p) {
                return p.dataLabel.attr('visibility');
            }),
        [visible, visible, visible, visible],
        'Initial labels'
    );

    chart.xAxis[0].setExtremes(3.2, 3.5);

    assert.deepEqual(
        chart.series[0].points
            .map(function (p) {
                return p.dataLabel.attr('visibility');
            }),
        [hidden, visible, hidden, hidden],
        'Shown and hidden labels'
    );

    chart.xAxis[0].setExtremes();

    assert.deepEqual(
        chart.series[0].points
            .map(function (p) {
                return p.dataLabel.attr('visibility');
            }),
        [visible, visible, visible, visible],
        'Reverted labels'
    );

    chart.xAxis[0].setExtremes(0, 0.5);

    assert.deepEqual(
        chart.series[0].points
            .map(function (p) {
                return p.dataLabel.attr('visibility');
            }),
        [visible, hidden, hidden, hidden],
        'Shown and hidden labels'
    );

    chart.xAxis[0].setExtremes();
    chart.series[0].addPoint({
        y: 1,
        x: 0.1,
        x2: 0.2,
        label: 'fifth'
    });
    chart.yAxis[0].setExtremes(0.5);

    assert.deepEqual(
        chart.series[0].points.map(function (p) {
            return p.dataLabel.attr('visibility');
        }),
        [hidden, hidden, hidden, hidden, visible],
        'Shown and hidden labels'
    );
});

QUnit.test('Stacking', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'xrange'
        },
        yAxis: {
            categories: ['First', 'Second'],
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: [
            {
                data: [
                    {
                        x: 0,
                        x2: 5,
                        y: 0
                    },
                    {
                        x: 5,
                        x2: 10,
                        y: 1
                    }
                ]
            },
            {
                data: [
                    {
                        x: 5,
                        x2: 10,
                        y: 0
                    },
                    {
                        x: 0,
                        x2: 5,
                        y: 1
                    }
                ]
            }
        ]
    });

    assert.ok(
        chart.series[0].options.stacking === undefined,
        'Stacking should be disabled.'
    );
});

QUnit.test('#13811: partialFill application order', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'xrange'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            categories: ['Prototyping', 'Development', 'Testing'],
            reversed: true
        },
        series: [
            {
                name: 'Project 1',
                borderColor: 'gray',
                pointWidth: 20,
                partialFill: {
                    fill: 'red'
                },
                data: [
                    {
                        x: Date.UTC(2014, 10, 21),
                        x2: Date.UTC(2014, 11, 2),
                        y: 0,
                        partialFill: {
                            fill: 'black',
                            amount: 0.25
                        }
                    },
                    {
                        x: Date.UTC(2014, 11, 2),
                        x2: Date.UTC(2014, 11, 5),
                        y: 1
                    },
                    {
                        x: Date.UTC(2014, 11, 8),
                        x2: Date.UTC(2014, 11, 9),
                        y: 2,
                        partialFill: {
                            amount: 0.5
                        }
                    },
                    {
                        x: Date.UTC(2014, 11, 9),
                        x2: Date.UTC(2014, 11, 19),
                        y: 1
                    },
                    {
                        x: Date.UTC(2014, 11, 10),
                        x2: Date.UTC(2014, 11, 23),
                        y: 2
                    }
                ],
                dataLabels: {
                    enabled: true
                }
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].points[0].graphic.partRect.attr('fill'),
        'black',
        'Point.partialFill should take priority'
    );
    assert.strictEqual(
        chart.series[0].points[2].graphic.partRect.attr('fill'),
        'red',
        'Series.partialFill should still work'
    );
});

QUnit.test('XRange series and tooltip position', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'xrange'
        },
        yAxis: {
            categories: ['First', 'Second']
        },
        series: [
            {
                data: [
                    {
                        x: 0,
                        x2: 5,
                        y: 0
                    },
                    {
                        x: 5,
                        x2: 10,
                        y: 1
                    }
                ]
            },
            {
                data: [
                    {
                        x: 5,
                        x2: 10,
                        y: 0
                    },
                    {
                        x: 0,
                        x2: 5,
                        y: 1
                    }
                ]
            }
        ]
    });

    chart.tooltip.refresh(chart.series[0].points[0]);

    var labelBox = chart.tooltip.label.element.getBoundingClientRect();
    var pointGraphicBox = chart.series[0].points[0].graphic.element
        .getBoundingClientRect();

    // Precision up to 2 pixels
    assert.close(
        labelBox.left + labelBox.width / 2,
        pointGraphicBox.left + pointGraphicBox.width / 2,
        2,
        'No inverted chart, no reversed xAxis, no reversed yAxis'
    );

    chart.update({
        yAxis: {
            reversed: true
        }
    });

    chart.tooltip.refresh(chart.series[0].points[0]);

    labelBox = chart.tooltip.label.element.getBoundingClientRect();
    pointGraphicBox = chart.series[0].points[0].graphic.element
        .getBoundingClientRect();

    // Precision up to 2 pixels
    assert.close(
        labelBox.left + labelBox.width / 2,
        pointGraphicBox.left + pointGraphicBox.width / 2,
        2,
        'No inverted chart, no reversed xAxis, reversed yAxis'
    );

    chart.update({
        xAxis: {
            reversed: true
        }
    });

    chart.tooltip.refresh(chart.series[0].points[0]);

    labelBox = chart.tooltip.label.element.getBoundingClientRect();
    pointGraphicBox = chart.series[0].points[0].graphic.element
        .getBoundingClientRect();

    // Precision up to 2 pixels
    assert.close(
        labelBox.left + labelBox.width / 2,
        pointGraphicBox.left + pointGraphicBox.width / 2,
        2,
        'No inverted chart, reversed xAxis, no reversed yAxis'
    );

    chart.update({
        xAxis: {
            reversed: true
        },
        yAxis: {
            reversed: true
        }
    });

    chart.tooltip.refresh(chart.series[0].points[0]);

    labelBox = chart.tooltip.label.element.getBoundingClientRect();
    pointGraphicBox = chart.series[0].points[0].graphic.element
        .getBoundingClientRect();

    // Precision up to 2 pixels
    assert.close(
        labelBox.left + labelBox.width / 2,
        pointGraphicBox.left + pointGraphicBox.width / 2,
        2,
        'No inverted chart, reversed xAxis, reversed yAxis'
    );

    chart.update({
        chart: {
            inverted: true
        },
        xAxis: {
            reversed: true
        },
        yAxis: {
            reversed: true
        }
    });

    chart.tooltip.refresh(chart.series[0].points[0]);

    labelBox = chart.tooltip.label.element.getBoundingClientRect();
    pointGraphicBox = chart.series[0].points[0].graphic.element
        .getBoundingClientRect();

    // Precision up to 2 pixels
    assert.close(
        labelBox.top + labelBox.height / 2,
        pointGraphicBox.top + pointGraphicBox.height / 2,
        2.001,
        'Inverted chart, reversed xAxis, reversed yAxis'
    );

    chart.update({
        chart: {
            inverted: true
        }
    });

    chart.tooltip.refresh(chart.series[0].points[0]);

    labelBox = chart.tooltip.label.element.getBoundingClientRect();
    pointGraphicBox = chart.series[0].points[0].graphic.element
        .getBoundingClientRect();

    // Precision up to 2 pixels
    assert.close(
        labelBox.top + labelBox.height / 2,
        pointGraphicBox.top + pointGraphicBox.height / 2,
        2.001,
        'Inverted chart, no reversed xAxis, no reversed yAxis'
    );

    chart.update({
        chart: {
            inverted: true
        },
        xAxis: {
            reversed: true
        }
    });

    chart.tooltip.refresh(chart.series[0].points[0]);

    labelBox = chart.tooltip.label.element.getBoundingClientRect();
    pointGraphicBox = chart.series[0].points[0].graphic.element
        .getBoundingClientRect();

    // Precision up to 2 pixels
    assert.close(
        labelBox.top + labelBox.height / 2,
        pointGraphicBox.top + pointGraphicBox.height / 2,
        2.001,
        'Inverted chart, reversed xAxis, no reversed yAxis'
    );

    chart.update({
        chart: {
            inverted: true
        },
        yAxis: {
            reversed: true
        }
    });

    chart.tooltip.refresh(chart.series[0].points[0]);

    labelBox = chart.tooltip.label.element.getBoundingClientRect();
    pointGraphicBox = chart.series[0].points[0].graphic.element
        .getBoundingClientRect();

    // Precision up to 2 pixels
    assert.close(
        labelBox.top + labelBox.height / 2,
        pointGraphicBox.top + pointGraphicBox.height / 2,
        2.001,
        'Inverted chart, no reversed xAxis, reversed yAxis'
    );

    chart.update({
        chart: {
            inverted: false
        },
        xAxis: {
            reversed: false
        }
    });

    chart.xAxis[0].setExtremes(4.8, 10);
    chart.tooltip.refresh(chart.series[0].points[0]);

    const chartContainer = chart.container.getBoundingClientRect();
    labelBox = chart.tooltip.label.element.getBoundingClientRect();

    assert.close(
        labelBox.left + labelBox.width / 2,
        chart.plotLeft + chartContainer.left,
        2,
        'Tooltip on plotLeft when only far right part of the point is visible'
    );

    chart.update({
        xAxis: {
            left: '75%',
            width: '25%'
        },
        yAxis: {
            top: '75%',
            height: '25%'
        }
    });

    const point = chart.series[0].points[0];

    assert.strictEqual(
        point.tooltipPos[0],
        chart.xAxis[0].left - chart.plotLeft,
        'Tooltip position should be correct on the resized x-axis. (#19343)'
    );

    assert.ok(
        point.tooltipPos[1] > chart.yAxis[0].top - chart.plotTop,
        `Tooltip y position should be greater than the top boundery of the
        resized y-axis. (#19343)`
    );
});

QUnit.test('XRange series tooltip correct formatting (#19362)', assert => {

    const chart = Highcharts.chart('container', {
        chart: {
            type: 'xrange'
        },
        title: {
            text: 'X-range standard'
        },
        yAxis: {
            title: {
                text: ''
            },
            categories: ['Prototyping', 'Development', 'Testing'],
            reversed: true
        },
        series: [{
            name: 'Project 1',
            data: [{
                x: 1,
                x2: 2,
                name: 'Start prototype',
                y: 0
            }, {
                x: 2,
                x2: 5,
                name: 'Develop',
                y: 1
            }, {
                x: 6,
                x2: 8,
                name: 'Run acceptance tests',
                y: 2
            }]
        }]
    });

    // Open the tooltip for the first point
    chart.tooltip.refresh(chart.series[0].points[0]);
    // Get the tooltip text
    let tooltipText = chart.tooltip.label.text.textStr;

    assert.ok(
        tooltipText.includes('1 - 2'),
        'Tooltip for number axis is correctly formatted.'
    );

    chart.update({
        title: {
            text: 'X-range datatime'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: ''
            },
            categories: ['Prototyping', 'Development', 'Testing'],
            reversed: true
        },
        series: [{
            name: 'Project 1',
            data: [{
                x: Date.UTC(2023, 10, 21),
                x2: Date.UTC(2023, 11, 2),
                y: 0
            }, {
                x: Date.UTC(2023, 11, 2),
                x2: Date.UTC(2023, 11, 5),
                name: 'Develop',
                y: 1
            }, {
                x: Date.UTC(2023, 11, 10),
                x2: Date.UTC(2023, 11, 23),
                name: 'Run acceptance tests',
                y: 2
            }]
        }]
    });

    chart.tooltip.refresh(chart.series[0].points[1]);

    tooltipText = chart.tooltip.label.text.textStr;

    assert.ok(
        tooltipText.includes('Saturday,  2 Dec 2023 - Tuesday,  5 Dec 2023'),
        'Tooltip for datetime axis is correctly formatted.'
    );

});

QUnit.test('X-range zooming', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'xrange',
            zoomType: 'x',
            width: 600
        },
        title: {
            text: 'Highcharts X-range'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: ''
            },
            categories: ['Prototyping', 'Development', 'Testing'],
            reversed: true
        },
        series: [{
            name: 'Project 1',
            // pointPadding: 0,
            // groupPadding: 0,
            borderColor: 'gray',
            pointWidth: 20,
            data: [{
                x: Date.UTC(2014, 10, 21),
                x2: Date.UTC(2014, 11, 2),
                y: 0,
                partialFill: 0.25
            }, {
                x: Date.UTC(2014, 11, 2),
                x2: Date.UTC(2014, 11, 5),
                y: 1
            }, {
                x: Date.UTC(2014, 11, 8),
                x2: Date.UTC(2014, 11, 9),
                y: 2
            }, {
                x: Date.UTC(2014, 11, 9),
                x2: Date.UTC(2014, 11, 19),
                y: 1
            }, {
                x: Date.UTC(2014, 11, 10),
                x2: Date.UTC(2014, 11, 23),
                y: 2
            }, {
                x: Date.UTC(2014, 11, 24),
                x2: Date.UTC(2014, 11, 25),
                y: 2
            }, {
                x: Date.UTC(2014, 11, 26),
                x2: Date.UTC(2014, 11, 27),
                y: 2
            }, {
                x: Date.UTC(2014, 11, 28),
                x2: Date.UTC(2014, 11, 29),
                y: 2
            }, {
                x: Date.UTC(2014, 12, 1),
                x2: Date.UTC(2014, 12, 2),
                y: 2
            }, {
                x: Date.UTC(2014, 12, 3),
                x2: Date.UTC(2014, 12, 4),
                y: 2
            }, {
                x: Date.UTC(2014, 12, 5),
                x2: Date.UTC(2014, 12, 6),
                y: 2
            }, {
                x: Date.UTC(2014, 12, 7),
                x2: Date.UTC(2014, 12, 8),
                y: 2
            }, {
                x: Date.UTC(2014, 12, 9),
                x2: Date.UTC(2014, 12, 10),
                y: 2
            }, {
                x: Date.UTC(2014, 12, 11),
                x2: Date.UTC(2014, 12, 12),
                y: 2
            }, {
                x: Date.UTC(2014, 12, 13),
                x2: Date.UTC(2014, 12, 14),
                y: 2
            }, {
                x: Date.UTC(2014, 12, 15),
                x2: Date.UTC(2014, 12, 16),
                y: 2
            }, {
                x: Date.UTC(2014, 12, 17),
                x2: Date.UTC(2014, 12, 18),
                y: 2
            }, {
                x: Date.UTC(2014, 12, 19),
                x2: Date.UTC(2014, 12, 20),
                y: 2
            }, {
                x: Date.UTC(2014, 12, 21),
                x2: Date.UTC(2014, 12, 22),
                y: 2
            }, {
                x: Date.UTC(2014, 12, 23),
                x2: Date.UTC(2014, 12, 24),
                y: 2
            }, {
                x: Date.UTC(2014, 12, 25),
                x2: Date.UTC(2014, 12, 26),
                y: 2
            }, {
                x: Date.UTC(2014, 11, 8),
                x2: Date.UTC(2014, 11, 9),
                y: 0
            }, {
                x: Date.UTC(2014, 11, 9),
                x2: Date.UTC(2014, 11, 19),
                y: 1
            }, {
                x: Date.UTC(2014, 11, 10),
                x2: Date.UTC(2014, 11, 23),
                y: 0
            }, {
                x: Date.UTC(2014, 11, 24),
                x2: Date.UTC(2014, 11, 25),
                y: 0
            }, {
                x: Date.UTC(2014, 11, 26),
                x2: Date.UTC(2014, 11, 27),
                y: 0
            }, {
                x: Date.UTC(2014, 11, 28),
                x2: Date.UTC(2014, 11, 29),
                y: 0
            }, {
                x: Date.UTC(2014, 12, 1),
                x2: Date.UTC(2014, 12, 2),
                y: 0
            }, {
                x: Date.UTC(2014, 12, 3),
                x2: Date.UTC(2014, 12, 4),
                y: 0
            }, {
                x: Date.UTC(2014, 12, 5),
                x2: Date.UTC(2014, 12, 6),
                y: 0
            }, {
                x: Date.UTC(2014, 12, 7),
                x2: Date.UTC(2014, 12, 8),
                y: 0
            }, {
                x: Date.UTC(2014, 12, 9),
                x2: Date.UTC(2014, 12, 10),
                y: 0
            }, {
                x: Date.UTC(2014, 12, 11),
                x2: Date.UTC(2014, 12, 12),
                y: 0
            }, {
                x: Date.UTC(2014, 12, 13),
                x2: Date.UTC(2014, 12, 14),
                y: 0
            }, {
                x: Date.UTC(2014, 12, 15),
                x2: Date.UTC(2014, 12, 16),
                y: 0
            }, {
                x: Date.UTC(2014, 12, 17),
                x2: Date.UTC(2014, 12, 18),
                y: 0
            }, {
                x: Date.UTC(2014, 12, 19),
                x2: Date.UTC(2014, 12, 20),
                y: 0
            }, {
                x: Date.UTC(2014, 12, 21),
                x2: Date.UTC(2014, 12, 22),
                y: 0
            }, {
                x: Date.UTC(2014, 12, 23),
                x2: Date.UTC(2014, 12, 24),
                y: 0
            }, {
                x: Date.UTC(2014, 12, 25),
                x2: Date.UTC(2014, 12, 26),
                y: 0
            }, {
                x: Date.UTC(2014, 11, 8),
                x2: Date.UTC(2014, 11, 9),
                y: 1
            }, {
                x: Date.UTC(2014, 11, 9),
                x2: Date.UTC(2014, 11, 19),
                y: 1
            }, {
                x: Date.UTC(2014, 11, 10),
                x2: Date.UTC(2014, 11, 23),
                y: 1
            }, {
                x: Date.UTC(2014, 11, 24),
                x2: Date.UTC(2014, 11, 25),
                y: 1
            }, {
                x: Date.UTC(2014, 11, 26),
                x2: Date.UTC(2014, 11, 27),
                y: 1
            }, {
                x: Date.UTC(2014, 11, 28),
                x2: Date.UTC(2014, 11, 29),
                y: 1
            }, {
                x: Date.UTC(2014, 12, 1),
                x2: Date.UTC(2014, 12, 2),
                y: 1
            }, {
                x: Date.UTC(2014, 12, 3),
                x2: Date.UTC(2014, 12, 4),
                y: 1
            }, {
                x: Date.UTC(2014, 12, 5),
                x2: Date.UTC(2014, 12, 6),
                y: 1
            }, {
                x: Date.UTC(2014, 12, 7),
                x2: Date.UTC(2014, 12, 8),
                y: 1
            }, {
                x: Date.UTC(2014, 12, 9),
                x2: Date.UTC(2014, 12, 10),
                y: 1
            }, {
                x: Date.UTC(2014, 12, 11),
                x2: Date.UTC(2014, 12, 12),
                y: 1
            }, {
                x: Date.UTC(2014, 12, 13),
                x2: Date.UTC(2014, 12, 14),
                y: 1
            }, {
                x: Date.UTC(2014, 12, 15),
                x2: Date.UTC(2014, 12, 16),
                y: 1
            }, {
                x: Date.UTC(2014, 12, 17),
                x2: Date.UTC(2014, 12, 18),
                y: 1
            }, {
                x: Date.UTC(2014, 12, 19),
                x2: Date.UTC(2014, 12, 20),
                y: 1
            }, {
                x: Date.UTC(2014, 12, 21),
                x2: Date.UTC(2014, 12, 22),
                y: 1
            }, {
                x: Date.UTC(2014, 12, 23),
                x2: Date.UTC(2014, 12, 24),
                y: 1
            }, {
                x: Date.UTC(2014, 12, 25),
                x2: Date.UTC(2014, 12, 26),
                y: 1
            }],
            dataLabels: {
                enabled: true
            }
        }]

    });

    chart.xAxis[0].setExtremes(
        Date.UTC(2014, 11, 30),
        Date.UTC(2015, 0, 10, 12)
    );

    assert.ok(
        chart.series[0].points.length >= 15,
        'Points within the plot area (at least) should be kept (#21003)'
    );
});