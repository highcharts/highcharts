QUnit.test(
    'Whiskers set by number and by percentage (string)(#2801)',
    function (assert) {
        $('#container').highcharts({
            chart: {
                type: 'boxplot',
                width: 405
            },
            plotOptions: {
                series: {
                    grouping: false
                }
            },
            series: [
                {
                    whiskerLength: '50%',
                    pointWidth: 50,
                    data: [
                        [760, 801, 848, 895, 965],
                        [760, 801, 848, 895, 965]
                    ]
                },
                {
                    whiskerLength: 42,
                    data: [[2, 760, 801, 848, 895, 965]]
                }
            ]
        });

        var chart = $('#container').highcharts();

        assert.strictEqual(
            chart.series[0].points[0].whiskers.getBBox(true).width,
            25,
            'whiskerLength set by percent'
        );
        assert.strictEqual(
            chart.series[1].points[0].whiskers.getBBox(true).width,
            42,
            'whiskerLength set by number'
        );
    }
);

QUnit.test('Individual fill color (#5770)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'boxplot'
        },

        plotOptions: {
            boxplot: {
                fillColor: 'blue'
            }
        },

        series: [
            {
                name: 'Observations',
                data: [
                    {
                        low: 760,
                        q1: 801,
                        median: 848,
                        q3: 895,
                        high: 965,
                        fillColor: 'red'
                    },
                    [733, 853, 939, 980, 1080]
                ]
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].points[0].box.element.getAttribute('fill'),
        'red',
        'Individual fill'
    );
    assert.strictEqual(
        chart.series[0].points[1].box.element.getAttribute('fill'),
        'blue',
        'Generic fill'
    );
});

QUnit.test('Individual options and Point.update', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'boxplot'
        },

        series: [
            {
                data: [[760, 801, 848, 895, 965]]
            }
        ]
    });

    const point = chart.series[0].points[0],
        upperWhiskerLength = 32,
        lowerWhiskerLength = 48;

    point.update(
        {
            color: 'red',
            fillColor: '#F0F0E0',
            medianColor: '#0C5DA5',
            medianWidth: 3,
            stemColor: '#A63400',
            stemDashStyle: 'dot',
            stemWidth: 1,
            whiskerColor: '#3D9200',
            whiskerWidth: 3,
            upperWhiskerLength: 32,
            lowerWhiskerLength: 48
        },
        true,
        false
    );

    assert.strictEqual(point.box.attr('stroke'), 'red', 'color');
    assert.strictEqual(
        point.box.attr('fill').toUpperCase(),
        '#F0F0E0',
        'fillColor'
    );
    assert.strictEqual(
        point.medianShape.attr('stroke'),
        '#0C5DA5',
        'medianColor'
    );
    assert.strictEqual(
        point.medianShape.attr('stroke-width'),
        3,
        'medianWidth'
    );

    assert.strictEqual(point.stem.attr('stroke'), '#A63400', 'stemColor');

    assert.strictEqual(
        point.stem.attr('stroke-dasharray').replace(/[ px]/g, ''),
        '1,3',
        'stemDashStyle'
    );
    assert.strictEqual(point.stem.attr('stroke-width'), 1, 'stemWidth');
    assert.strictEqual(
        point.whiskers.attr('stroke'),
        '#3D9200',
        'whiskerColor'
    );
    assert.strictEqual(point.whiskers.attr('stroke-width'), 3, 'whiskerWidth');

    const [
        upperMoveTo,
        upperLineTo,
        lowerMoveTo,
        lowerLineTo
    ] = point.whiskers.pathArray;

    assert.strictEqual(
        upperLineTo[1] - upperMoveTo[1],
        upperWhiskerLength,
        'Upper whisker\'s length should be configured appropriately'
    );

    assert.strictEqual(
        lowerLineTo[1] - lowerMoveTo[1],
        lowerWhiskerLength,
        'Lower whisker\'s length should be configured appropriately'
    );
});

QUnit.test(
    'All-null data point should not affect Y axis scale (#7380)',
    function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'boxplot'
            },
            series: [
                {
                    name: 'Observations',
                    data: [
                        [], // comment this out to get a plot to show up
                        {
                            x: 1,
                            low: 714,
                            q1: 762,
                            median: 817,
                            q3: 870,
                            high: 918
                        }
                    ]
                }
            ],
            yAxis: {
                endOnTick: false,
                maxPadding: 0
            }
        });

        assert.strictEqual(
            chart.yAxis[0].max,
            918,
            'Y axis max should consider the one valid point'
        );
    }
);

QUnit.test(
    'Individual dash styles for box, median, stem and whisker lines (#13065)',
    function (assert) {
        const chart = Highcharts.chart('container', {
            chart: {
                type: 'boxplot'
            },

            series: [
                {
                    dashStyle: 'DashDot',
                    medianDashStyle: 'ShortDash',
                    whiskerDashStyle: 'dot',
                    data: [
                        {
                            low: 760,
                            q1: 801,
                            median: 848,
                            q3: 895,
                            high: 965,
                            boxDashStyle: 'dot',
                            medianDashStyle: 'dot',
                            stemDashStyle: 'dot',
                            whiskerDashStyle: 'dot',
                            whiskerWidth: 1,
                            medianWidth: 1
                        },
                        {
                            low: 733,
                            q1: 853,
                            median: 939,
                            q3: 980,
                            high: 1080
                        }
                    ]
                }
            ]
        });

        const series = chart.series[0],
            firstPoint = series.points[0],
            secondPoint = series.points[1];

        ['box', 'medianShape', 'stem', 'whiskers'].forEach(function (elem) {
            assert.strictEqual(
                firstPoint[elem].attr('stroke-dasharray'),
                '1,3',
                'Dot dashStyle should be applied to the first point\'s ' +
                    elem +
                    '.'
            );
        });

        assert.strictEqual(
            secondPoint.medianShape.attr('stroke-dasharray'),
            '6,2',
            'ShortDash dashStyle should be applied to the second point\'s ' +
            'median.'
        );

        assert.strictEqual(
            secondPoint.whiskers.attr('stroke-dasharray'),
            '2,6',
            'Dot dashStyle should be applied to the second point\'s whiskers.'
        );

        assert.strictEqual(
            secondPoint.box.attr('stroke-dasharray'),
            '4,3,1,3',
            'DashDot dashStyle should be applied to the second point\'s box.'
        );

        assert.strictEqual(
            secondPoint.stem.attr('stroke-dasharray'),
            '4,3,1,3',
            'DashDot dashStyle should be applied to the second point\'s stem.'
        );

        chart.series[0].update({
            dashStyle: 'normal',
            medianDashStyle: 'normal',
            whiskerDashStyle: 'normal',
            data: [{
                low: 194.0,
                q1: 205.52,
                median: 207.36,
                q3: 209.08,
                high: 317.58
            }]
        }, false);

        chart.addSeries({
            data: [{
                low: 195.64,
                q1: 204.16,
                median: 205.72,
                q3: 207.48,
                high: 275.4
            }]
        });

        const whiskersBox = chart.series[0].points[0].whiskers.getBBox(),
            whiskersCenter = whiskersBox.x + (whiskersBox.width / 2),
            { shapeArgs } = chart.series[0].points[0],
            pointCenter = shapeArgs.x + (shapeArgs.width / 2);

        assert.close(
            whiskersCenter,
            pointCenter,
            0.501,
            `Whiskers and stem should be placed correctly in the center of point
            for multiple boxplot series, #21245.`
        );
    }
);

QUnit.test('All values should be draggable (#13576)', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'boxplot'
        },
        series: [
            {
                dragDrop: {
                    draggableY: true,
                    draggableQ1: true,
                    draggableQ3: true,
                    draggableLow: true,
                    draggableHigh: true
                },
                data: [
                    [700, 750, 848, 905, 965],
                    [650, 700, 939, 1080, 1180]
                ]
            }
        ]
    });

    const point = chart.series[0].points[0];
    let result;

    point.showDragHandles();

    const highHandleY = chart.dragHandles.draggableHigh.translateY,
        lowHandleY = chart.dragHandles.draggableLow.translateY,
        Q1HandleY = chart.dragHandles.draggableQ1.translateY,
        Q3HandleY = chart.dragHandles.draggableQ3.translateY;

    if (
        Math.abs(highHandleY - point.highPlot) <= 1 &&
        Math.abs(lowHandleY - point.lowPlot) <= 1 &&
        Math.abs(Q1HandleY - point.q1Plot) <= 1 &&
        Math.abs(Q3HandleY - point.q3Plot) <= 1
    ) {
        result = true;
    }

    assert.ok(result, 'Drag handles are rendered in correct positions.');
});

QUnit.test('Data labels for boxplot statistics (#23904)', function (assert) {
    let formatterValues;

    const chart = Highcharts.chart('container', {
            chart: {
                type: 'boxplot'
            },
            title: {
                text: null
            },
            yAxis: {
                min: 0,
                max: 12
            },
            series: [{
                dataLabels: [{
                    enabled: true,
                    pointValKey: 'high',
                    format: 'High: {point.high}'
                }, {
                    enabled: true,
                    pointValKey: 'q3',
                    format: 'Q3: {point.q3}',
                    y: 5
                }, {
                    enabled: true,
                    pointValKey: 'median',
                    formatter: function (options) {
                        formatterValues = [
                            this.low,
                            this.q1,
                            this.median,
                            this.q3,
                            this.high
                        ];

                        // The label value is selected through the pointValKey
                        // passed in the label options (#23904)
                        return 'Median: ' + this[options.pointValKey];
                    }
                }, {
                    enabled: true,
                    pointValKey: 'q1',
                    format: 'Q1: {point.q1}'
                }, {
                    enabled: true,
                    pointValKey: 'low',
                    format: 'Low: {point.low}'
                }],
                data: [[1, 3, 5, 7, 9]]
            }]
        }),
        point = chart.series[0].points[0],
        assertLabels = function (expectedLabels, message) {
            const highLabel = point.dataLabels[0],
                medianLabel = point.dataLabels[2],
                q1Label = point.dataLabels[3],
                lowLabel = point.dataLabels[4];

            assert.deepEqual(
                point.dataLabels.map(label => label.text.textStr),
                expectedLabels,
                message + ': labels are formatted from selected statistics'
            );

            assert.ok(
                highLabel.y + highLabel.height <= point.highPlot + 1,
                message + ': high label is above the high whisker'
            );

            assert.ok(
                medianLabel.y + medianLabel.height <= point.medianPlot + 1,
                message + ': median label is above the median line'
            );

            assert.ok(
                q1Label.y + q1Label.height <= point.q1Plot + 1,
                message + ': q1 label is above the q1 line'
            );

            assert.ok(
                lowLabel.y >= point.lowPlot - 1,
                message + ': low label is below the low whisker'
            );
        };

    assert.strictEqual(
        point.dataLabels.length,
        5,
        'High, q3, median, q1 and low labels are rendered'
    );

    assert.strictEqual(
        chart.container.querySelectorAll('.highcharts-data-label').length,
        5,
        'A custom y offset on one label does not create duplicate labels'
    );

    assert.deepEqual(
        formatterValues,
        [1, 3, 5, 7, 9],
        'Formatter has access to all five boxplot statistics'
    );

    assertLabels(
        [
            'High: 9',
            'Q3: 7',
            'Median: 5',
            'Q1: 3',
            'Low: 1'
        ],
        'Initial render'
    );

    point.update({
        low: 2,
        q1: 4,
        median: 6,
        q3: 8,
        high: 10
    }, true, false);

    assertLabels(
        [
            'High: 10',
            'Q3: 8',
            'Median: 6',
            'Q1: 4',
            'Low: 2'
        ],
        'After update'
    );

    assert.strictEqual(
        chart.container.querySelectorAll('.highcharts-data-label').length,
        5,
        'A custom y offset still does not create duplicate labels after update'
    );
});

QUnit.test(
    'Data labels for boxplot statistics, inverted (#23904)',
    function (assert) {
        const chart = Highcharts.chart('container', {
                chart: {
                    type: 'boxplot',
                    inverted: true
                },
                title: {
                    text: null
                },
                yAxis: {
                    min: 0,
                    max: 12
                },
                series: [{
                    dataLabels: [{
                        enabled: true,
                        pointValKey: 'high',
                        format: 'High: {point.high}'
                    }, {
                        enabled: true,
                        pointValKey: 'low',
                        format: 'Low: {point.low}'
                    }],
                    data: [[1, 3, 5, 7, 9]]
                }]
            }),
            point = chart.series[0].points[0],
            highLabel = point.dataLabels[0],
            lowLabel = point.dataLabels[1];

        assert.deepEqual(
            point.dataLabels.map(label => label.text.textStr),
            ['High: 9', 'Low: 1'],
            'Both labels are rendered on an inverted chart'
        );

        // On an inverted chart the value axis is horizontal, so the higher
        // value must be placed to the right of the lower value
        assert.ok(
            highLabel.x > lowLabel.x,
            'High label is placed to the right of the low label'
        );

        // The high label aligns to the high whisker (left edge near highPlot),
        // the low label to the low whisker (right edge near lowPlot)
        assert.ok(
            highLabel.x + 1 >= point.highPlot,
            'High label is aligned to the high whisker'
        );

        assert.ok(
            lowLabel.x - 1 <= point.lowPlot,
            'Low label is aligned to the low whisker'
        );
    }
);

QUnit.test(
    'Box plot data labels default formatter (#23904)',
    function (assert) {
        const chart = Highcharts.chart('container', {
            chart: {
                type: 'boxplot'
            },
            title: {
                text: null
            },
            series: [{
                // Array of labels without an explicit format/formatter
                dataLabels: [{
                    enabled: true,
                    pointValKey: 'high'
                }, {
                    enabled: true,
                    pointValKey: 'low'
                }],
                data: [[1, 3, 5, 7, 9]]
            }, {
                // Single label without pointValKey defaults to high
                dataLabels: {
                    enabled: true
                },
                data: [[1, 3, 5, 7, 9]]
            }]
        });

        assert.deepEqual(
            chart.series[0].points[0].dataLabels
                .map(label => label.text.textStr),
            ['9', '1'],
            'Each label defaults to the value of its own pointValKey'
        );

        assert.strictEqual(
            chart.series[1].points[0].dataLabel.text.textStr,
            '9',
            'A label without pointValKey defaults to the high value'
        );

        // An invalid pointValKey falls back to the series pointValKey (high)
        // instead of reading an arbitrary point[...Plot] key (#23904)
        const invalidChart = Highcharts.chart('container', {
                chart: {
                    type: 'boxplot'
                },
                series: [{
                    dataLabels: {
                        enabled: true,
                        pointValKey: 'notAValue'
                    },
                    data: [[1, 3, 5, 7, 9]]
                }]
            }),
            invalidPoint = invalidChart.series[0].points[0];

        assert.strictEqual(
            invalidPoint.dataLabel.text.textStr,
            '9',
            'Invalid pointValKey falls back to the series pointValKey'
        );

        assert.ok(
            invalidPoint.dataLabel.y + invalidPoint.dataLabel.height <=
                invalidPoint.highPlot + 1,
            'Label with invalid pointValKey is aligned to the high whisker'
        );
    }
);

QUnit.test(
    'Box plot data labels keep the standard y context (#23904)',
    function (assert) {
        const yValues = [];

        const chart = Highcharts.chart('container', {
            chart: {
                type: 'boxplot'
            },
            title: {
                text: null
            },
            series: [{
                dataLabels: [{
                    enabled: true,
                    pointValKey: 'high',
                    formatter: function () {
                        yValues.push(this.y);
                        return '{this.y}=' + this.y;
                    }
                }, {
                    enabled: true,
                    pointValKey: 'low',
                    format: '{point.y}'
                }],
                data: [[1, 3, 5, 7, 9]]
            }]
        });

        assert.deepEqual(
            chart.series[0].points[0].dataLabels
                .map(label => label.text.textStr),
            ['{this.y}=9', '9'],
            'this.y and {point.y} keep resolving to the point y value'
        );

        assert.deepEqual(
            yValues,
            [9],
            'this.y inside the formatter equals the point y value'
        );

        assert.strictEqual(
            chart.series[0].points[0].y,
            9,
            'point.y keeps the series value after rendering'
        );

        // dataLabels.filter keeps comparing against the point value. Use
        // point.low or another statistic explicitly to filter by box plot
        // values.
        const filterChart = Highcharts.chart('container', {
                chart: {
                    type: 'boxplot'
                },
                series: [{
                    dataLabels: [{
                        enabled: true,
                        pointValKey: 'high',
                        format: 'H',
                        filter: { property: 'y', operator: '<', value: 5 }
                    }, {
                        enabled: true,
                        pointValKey: 'low',
                        format: 'L',
                        filter: { property: 'y', operator: '<', value: 5 }
                    }],
                    data: [[1, 3, 5, 7, 9]]
                }]
            }),
            filterPoint = filterChart.series[0].points[0];

        assert.deepEqual(
            (filterPoint.dataLabels || []).map(label => label.text.textStr),
            [],
            'No label passes a filter on y < 5 because point.y is high'
        );
    }
);

QUnit.test(
    'Point-level box plot data label arrays are reused on redraw (#23904)',
    function (assert) {
        const chart = Highcharts.chart('container', {
                chart: {
                    type: 'boxplot'
                },
                title: {
                    text: null
                },
                series: [{
                    dataLabels: {
                        enabled: true,
                        format: 'Series'
                    },
                    data: [{
                        low: 1,
                        q1: 3,
                        median: 5,
                        q3: 7,
                        high: 9,
                        dataLabels: [{
                            enabled: true,
                            pointValKey: 'low',
                            format: 'P-low'
                        }, {
                            enabled: true,
                            pointValKey: 'median',
                            format: 'P-median'
                        }]
                    }]
                }]
            }),
            point = chart.series[0].points[0],
            assertLabels = function (message) {
                assert.deepEqual(
                    point.dataLabels.map(label => label.text.textStr),
                    ['P-low', 'P-median'],
                    message + ': point-level labels are tracked on the point'
                );

                assert.strictEqual(
                    chart.container.querySelectorAll(
                        '.highcharts-data-label'
                    ).length,
                    2,
                    message + ': redraw does not duplicate point-level labels'
                );
            };

        assertLabels('Initial render');

        chart.redraw();
        assertLabels('First redraw');

        chart.redraw();
        assertLabels('Second redraw');
    }
);

QUnit.test(
    'Box plot data label arrays use separate groups (#23904)',
    function (assert) {
        const chart = Highcharts.chart('container', {
                chart: {
                    type: 'boxplot'
                },
                title: {
                    text: null
                },
                series: [{
                    dataLabels: [{
                        enabled: true,
                        pointValKey: 'high',
                        format: 'High',
                        zIndex: 2
                    }, {
                        enabled: true,
                        pointValKey: 'low',
                        format: 'Low',
                        zIndex: 20
                    }],
                    data: [[1, 3, 5, 7, 9]]
                }]
            }),
            series = chart.series[0],
            point = series.points[0],
            groups = series.dataLabelsGroups;

        assert.strictEqual(
            groups.length,
            2,
            'A separate group is created for each data label config'
        );

        assert.deepEqual(
            groups.map(group => group.attr('zIndex')),
            [2, 20],
            'Each data label config keeps its own group zIndex'
        );

        assert.notStrictEqual(
            point.dataLabels[0].parentGroup,
            point.dataLabels[1].parentGroup,
            'The two labels belong to different groups'
        );
    }
);

QUnit.test(
    'Data labels for boxplot statistics, reversed y axis (#23904)',
    function (assert) {
        const chart = Highcharts.chart('container', {
                chart: {
                    type: 'boxplot'
                },
                title: {
                    text: null
                },
                yAxis: {
                    min: 0,
                    max: 10,
                    reversed: true
                },
                series: [{
                    dataLabels: [{
                        enabled: true,
                        pointValKey: 'high',
                        format: 'High'
                    }, {
                        enabled: true,
                        pointValKey: 'low',
                        format: 'Low'
                    }],
                    data: [[3, 4, 5, 6, 7]]
                }]
            }),
            point = chart.series[0].points[0],
            highLabel = point.dataLabels[0],
            lowLabel = point.dataLabels[1];

        assert.ok(
            highLabel.y >= point.highPlot - 1,
            'High label is below the high whisker on a reversed y axis'
        );

        assert.ok(
            lowLabel.y + lowLabel.height <= point.lowPlot + 1,
            'Low label is above the low whisker on a reversed y axis'
        );
    }
);
