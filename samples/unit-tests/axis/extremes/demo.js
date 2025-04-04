QUnit.test(
    'Zooming too tight on left category should show full category (#4536)',
    function (assert) {
        var chart = $('#container')
            .highcharts({
                chart: {
                    type: 'column'
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
                    minRange: 0.99
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
                    },
                    {
                        data: [
                            144.0,
                            176.0,
                            135.6,
                            148.5,
                            216.4,
                            194.1,
                            95.6,
                            54.4,
                            29.9,
                            71.5,
                            106.4,
                            129.2
                        ]
                    },
                    {
                        data: [
                            144.0,
                            176.0,
                            135.6,
                            148.5,
                            216.4,
                            194.1,
                            95.6,
                            54.4,
                            29.9,
                            71.5,
                            106.4,
                            129.2
                        ]
                    }
                ]
            })
            .highcharts();

        assert.strictEqual(chart.xAxis[0].min, 0, 'Starting min');
        assert.strictEqual(chart.xAxis[0].max, 11, 'Starting max');

        chart.xAxis[0].setExtremes(0, 0.5);
        assert.strictEqual(chart.xAxis[0].min, 0, 'Ending min');
        assert.strictEqual(chart.xAxis[0].max, 0.99, 'Ending max');
        assert.strictEqual(
            typeof chart.xAxis[0].minPixelPadding,
            'number',
            'Category padding is a number'
        );
        assert.strictEqual(
            chart.xAxis[0].minPixelPadding > 0,
            true,
            'Category padding is more than 0'
        );
    }
);

QUnit.test('Log axis extremes, issue #934', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            height: 400
        },
        yAxis: {
            min: 1000,
            max: 1000000000,
            type: 'logarithmic',
            tickInterval: 1
        },
        series: [
            {
                data: [10000, 8900]
            },
            {
                data: [8600, 7700]
            }
        ]
    });

    var ext = chart.yAxis[0].getExtremes();
    assert.strictEqual(ext.min, 1000, 'Min is 1000');

    assert.strictEqual(ext.max, 1000000000, 'Max is 1000000000');
});

QUnit.test('Log axis extremes and precision', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'column'
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            title: {
                text: 'Title'
            },
            type: 'logarithmic'
        },
        series: [
            {
                name: 'Brands',
                colorByPoint: true,
                data: [
                    {
                        name: 'A',
                        y: 30
                    },
                    {
                        name: 'B',
                        y: 0
                    }
                ]
            }
        ]
    });

    assert.strictEqual(
        chart.yAxis[0].ticks[chart.yAxis[0].tickPositions[0]].label.textStr,
        '30',
        'Label should be exactly 30 (#4360)'
    );

    chart.update(
        {
            series: [
                {
                    data: [650]
                }
            ]
        },
        true,
        true
    );

    assert.strictEqual(
        chart.yAxis[0].ticks[chart.yAxis[0].tickPositions[0]].label.textStr,
        '650',
        'Single value logarithmic yAxis should show the same ' +
            'tick label as the points value (#11727)'
    );
});

QUnit.test(
    'setExtremes shouldn\'t return undefined min or max after zooming.(#1655)',
    function (assert) {
        var min,
            max,
            UNDEFINED,
            chart = new Highcharts.StockChart({
                chart: {
                    renderTo: 'container',
                    zooming: {
                        type: 'x'
                    }
                },

                series: [
                    {
                        data: [
                            [Date.UTC(2011, 1), 1],
                            [Date.UTC(2012, 1), 1]
                        ]
                    }
                ],

                xAxis: {
                    events: {
                        setExtremes: function (event) {
                            min = event.min;
                            max = event.max;
                        }
                    }
                }
            });

        // Set testing extremes:
        chart.xAxis[0].setExtremes(
            Date.UTC(2010, 1),
            Date.UTC(2013, 1),
            true,
            false
        );

        // Imitate left side zooming:
        chart.pointer.selectionMarker = chart.renderer
            .rect(chart.plotLeft + 50, chart.plotTop, 200, chart.plotHeight)
            .add();
        chart.pointer.hasDragged = true;
        chart.pointer.drop({});

        // Test:
        assert.strictEqual(min !== UNDEFINED, true, 'Proper minimum');

        // Reset extremes for a second test:
        chart.xAxis[0].setExtremes(
            Date.UTC(2010, 1),
            Date.UTC(2013, 1),
            true,
            false
        );

        // Imitate right side zooming:
        chart.pointer.selectionMarker = chart.renderer
            .rect(chart.plotLeft + 200, chart.plotTop, 200, chart.plotHeight)
            .add();
        chart.pointer.hasDragged = true;
        chart.pointer.drop({});

        // Test:
        assert.strictEqual(max !== UNDEFINED, true, 'Proper maximum');
    }
);

// Skip due to impractical mock objects
QUnit.skip('getSeriesExtremes', function (assert) {
    var getSeriesExtremes = Highcharts.Axis.prototype.getSeriesExtremes,
        xAxis = {
            getExtremes: Highcharts.Axis.prototype.getExtremes,
            isXAxis: true,
            series: [
                {
                    visible: true,
                    options: {},
                    getXExtremes: Highcharts.Series.prototype.getXExtremes,
                    reserveSpace: Highcharts.Series.prototype.reserveSpace
                }
            ]
        };

    /* Commented out because why should it throw?
    assert.throws(function () {
        getSeriesExtremes.call(xAxis);
    }, 'xAxis with undefined xData throws an error');
    */

    xAxis.series[0].xData = [];
    getSeriesExtremes.call(xAxis);
    assert.strictEqual(
        xAxis.dataMin,
        undefined,
        'xAxis with xData:[] gives dataMin:undefined'
    );
    assert.strictEqual(
        xAxis.dataMax,
        undefined,
        'xAxis with xData:[] gives dataMax:undefined'
    );
    xAxis.series[0].xData = [2, 7, 4];
    getSeriesExtremes.call(xAxis);
    assert.strictEqual(
        xAxis.dataMin,
        2,
        'xAxis with xData:[2, 7, 4] gives dataMin:2'
    );
    assert.strictEqual(
        xAxis.dataMax,
        7,
        'xAxis with xData:[2, 7, 4] gives dataMax:7'
    );
    xAxis.series[0].xData.push(null);
    getSeriesExtremes.call(xAxis);
    assert.strictEqual(
        xAxis.dataMin,
        2,
        'xAxis with xData:[2, 7, 4, null] gives dataMin:2'
    );
    assert.strictEqual(
        xAxis.dataMax,
        7,
        'xAxis with xData:[2, 7, 4, null] gives dataMax:7'
    );
    xAxis.series[0].xData.push(undefined);
    getSeriesExtremes.call(xAxis);
    assert.strictEqual(
        xAxis.dataMin,
        2,
        'xAxis with xData:[2, 7, 4, null, undefined] gives dataMin:2'
    );
    assert.strictEqual(
        xAxis.dataMax,
        7,
        'xAxis with xData:[2, 7, 4, null, undefined] gives dataMax:7'
    );

    /**
     * @todo Test the yAxis.getExtremes, but it is much work to mock the yAxis
     */
});


QUnit.test('Zooming', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                zooming: {
                    type: 'x'
                }
            },
            xAxis: {
                minRange: 0.5
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
            ],

            navigator: {
                enabled: true
            }
        }),
        controller = new TestController(chart);

    chart.xAxis[0].setExtremes(2.3, 2.7);

    assert.strictEqual(
        typeof chart.yAxis[0].min,
        'number',
        'Y axis has data. Zooming between points (#7061)'
    );

    chart.xAxis[0].setExtremes();

    controller.mouseDown(100, 200);
    controller.mouseMove(200, 200);
    controller.mouseUp();

    assert.strictEqual(
        Highcharts.isObject(chart.resetZoomButton),
        false,
        'No reset zoom button - blocked by navigator (#9285)'
    );

    chart.xAxis[0].setExtremes();

    chart.update({
        navigator: {
            enabled: false
        }
    });

    controller.mouseDown(100, 200);
    controller.mouseMove(200, 200);
    controller.mouseUp();

    assert.strictEqual(
        Highcharts.isObject(chart.resetZoomButton),
        true,
        'Chart has reset zoom button after zoom (#9285)'
    );
});

QUnit.test('X data with null and negative values (#7369)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'scatter'
        },
        series: [
            {
                data: [
                    {
                        x: null,
                        y: 95
                    },
                    {
                        x: 100,
                        y: 102.9
                    },
                    {
                        x: -80.8,
                        y: 91.5
                    }
                ]
            }
        ]
    });

    assert.ok(Highcharts.isNumber(chart.xAxis[0].min), 'Valid X axis min');
    assert.ok(Highcharts.isNumber(chart.xAxis[0].max), 'Valid X axis max');
    assert.ok(Highcharts.isNumber(chart.yAxis[0].min), 'Valid Y axis min');
    assert.ok(Highcharts.isNumber(chart.yAxis[0].max), 'Valid Y axis max');
});

QUnit.test(
    '#5493, #5823 - Extremes for xAxis with hidden series and dataGrouping',
    function (assert) {
        function getRandomData(start, end) {
            var data = [];

            for (; start <= end; start += 1000 * 60 * 10) {
                data.push([start, Math.random()]);
            }

            return data;
        }

        function equal(a, b, c) {
            return a === b && b === c && c === a;
        }

        var min = Date.UTC(2000, 0, 2),
            max = Date.UTC(2000, 0, 4),
            chart = $('#container')
                .highcharts('StockChart', {
                    legend: {
                        enabled: true
                    },
                    series: [
                        {
                            data: getRandomData(
                                Date.UTC(2000, 0, 1),
                                Date.UTC(2000, 0, 5)
                            )
                        },
                        {
                            data: getRandomData(min, max)
                        },
                        {
                            data: getRandomData(
                                Date.UTC(2000, 0, 1),
                                Date.UTC(2001, 0, 1)
                            ),
                            type: 'column',
                            visible: false
                        },
                        {
                            data: getRandomData(
                                Date.UTC(2000, 0, 1),
                                Date.UTC(2001, 0, 1)
                            ),
                            type: 'column',
                            visible: false
                        }
                    ]
                })
                .highcharts(),
            extremes,
            pointRange;

        chart.series[0].hide();
        extremes = chart.xAxis[0].getExtremes();

        assert.strictEqual(
            equal(extremes.dataMin, extremes.min, min),
            true,
            'Correct minimum: #5493'
        );
        assert.strictEqual(
            equal(extremes.dataMax, extremes.max, max),
            true,
            'Correct maximum: #5493'
        );

        // #5823
        chart.series[0].hide();
        chart.series[1].hide();
        chart.series[2].show();
        chart.series[3].show();
        pointRange = chart.xAxis[0].closestPointRange;
        chart.series[2].hide();

        assert.strictEqual(
            pointRange,
            chart.xAxis[0].closestPointRange,
            'Correct pointRange: #5823'
        );
    }
);

// Highcharts 4.0.1, Issue #3075
// Touch panning on categorized axis alters range
QUnit.test('Touch pan categories (#3075)', function (assert) {
    TestTemplate.test(
        'highcharts/area',
        {
            chart: {
                zooming: {
                    type: 'x'
                }
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
                    ]
                }
            ]
        },
        function (template) {
            var chart = template.chart,
                controller = new TestController(chart),
                xAxis = chart.xAxis[0];

            try {
                assert.deepEqual(
                    [typeof xAxis.userMin, typeof xAxis.userMax],
                    ['undefined', 'undefined'],
                    'The user range of x-axis should be undefined.'
                );

                xAxis.setExtremes(5, 11, true, false);

                assert.deepEqual(
                    [xAxis.userMin, xAxis.userMax],
                    [5, 11],
                    'The user range of x-axis should be set.'
                );

                controller.touchStart(300, 100, {
                    preventDefault: function () {}
                });

                controller.touchMove(100, 100, {
                    preventDefault: function () {}
                });

                controller.touchEnd(100, 100);

                assert.deepEqual(
                    [xAxis.userMin, xAxis.userMax],
                    [5, 11],
                    'The user range of x-axis should be unchanged.'
                );
            } finally {
                xAxis.setExtremes();
            }
        }
    );
});

// Highcharts v4.0.1, Issue #3104
// Touch panning falls back to data range, ignores axis min and max
QUnit.test('Touch panning falls back to data range (#3104)', function (assert) {
    const chart = Highcharts.chart(
        'container',
        {
            chart: {
                zooming: {
                    type: 'x'
                }
            },
            xAxis: {
                min: 0,
                max: 10
            },
            series: [
                {
                    name: 'blue',
                    color: 'blue',
                    data: [1, 4, 3, 4, 5, 5, 4],
                    pointStart: 4
                }
            ]
        },
        function (chart) {
            chart.xAxis[0].setExtremes(2, 15, true, false);
        }
    );
    const controller = new TestController(chart),
        tickPositions = chart.axes[0].tickPositions,
        touchPointX = (chart.plotSizeX + chart.plotLeft) / 2,
        touchPointY = (chart.plotSizeY + chart.plotTop) / 2,
        xAxis = chart.xAxis[0];

    function slide(testedAxis, x, y) {
        const extremes = testedAxis.getExtremes();

        controller.slide(
            [x + 200, y],
            [x - 100, y]
        );

        assert.notStrictEqual(
            extremes.min,
            testedAxis.min,
            'Ordinal xAxis min should change after touch sliding (#20877).'
        );

        assert.notStrictEqual(
            extremes.max,
            testedAxis.max,
            'Ordinal xAxis max should change after touch sliding (#20877).'
        );
    }

    controller.slide(
        [touchPointX, touchPointY],
        [touchPointX + 100, touchPointY]
    );

    var tickPositionsAfterSlide = chart.axes[0].tickPositions;

    assert.deepEqual(
        tickPositions,
        tickPositionsAfterSlide,
        'Tick positions has changed after touch sliding'
    );

    // Reset user-extremes
    xAxis.setExtremes();

    chart.update({
        chart: {
            zooming: {
                type: ''
            },
            panning: {
                enabled: true,
                type: 'x'
            }
        },
        xAxis: {
            type: 'datetime',
            ordinal: true,
            min: 0,
            max: 5
        },
        tooltip: {
            followTouchMove: false
        },
        series: [{
            data: [
                [0, 1],
                [1, 4],
                [4, 1],
                [5, 4],
                [6, 5],
                [7, 5],
                [10, 4],
                [11, 5],
                [12, 5],
                [13, 4]
            ]
        }]
    });

    // First slide: test if panning + ordinal works
    slide(xAxis, touchPointX, touchPointY);
    // Second slide: test if we zoom into different range
    slide(xAxis, touchPointX, touchPointY);
    // Now test if pinching still works
    xAxis.setExtremes(1, 10);
    chart.update({
        chart: {
            zooming: {
                type: 'x'
            }
        }
    });
    chart.pinching = true;
    controller.pinch(
        chart.plotLeft + chart.plotWidth - 20,
        chart.plotTop + chart.plotHeight - 20,
        -300
    );

    const extremes = xAxis.getExtremes();

    // Don't test exact extremes, as they are not deterministic:
    // depend on browser size
    assert.notDeepEqual(
        [extremes.min, extremes.max],
        [1, 10],
        'Axis should should zoom out on pinch out (#20877).'
    );
});

QUnit.test('Column zooming and Y axis extremes (#9944)', assert => {
    const chart = Highcharts.chart('container', {
        xAxis: {
            categories: ['One', 'Two', 'Three', 'Four'],
            minRange: 0.1
        },
        series: [
            {
                type: 'column',
                data: [10, 1, 1, 1]
            }
        ]
    });

    chart.xAxis[0].setExtremes(0.9, 1.1);

    assert.ok(
        chart.yAxis[0].max < 5,
        'The Y axis should adapt to the visible data (#9044)'
    );
});

QUnit.test(
    'When data grouping disabled and the axis extremes set out of ' +
        'the data range, the chart shouldn\'t crash, #13934.',
    function (assert) {
        const chart = Highcharts.stockChart('container', {
            plotOptions: {
                series: {
                    dataGrouping: {
                        enabled: false
                    }
                }
            },
            xAxis: {
                minRange: 1,
                min: 1533235200000,
                max: 1533235200000
            },
            series: [
                {
                    data: [
                        [1563235200000, 0],
                        [1563321600000, 1],
                        [1563408000000, 2],
                        [1563494400000, 3],
                        [1563753600000, 4]
                    ]
                }
            ]
        });
        assert.ok(chart, 'The chart exist ');
    }
);


QUnit.test('Date string extremes', function (assert) {
    const chart = Highcharts.chart('container', {
        series: [{
            data: [
                ['2024-06-04', 1],
                ['2024-06-05', 2],
                ['2024-06-06', 3],
                ['2024-06-07', 4],
                ['2024-06-08', 5],
                ['2024-06-09', 6],
                ['2024-06-10', 7],
                ['2024-06-11', 8],
                ['2024-06-12', 9],
                ['2024-06-13', 10],
                ['2024-06-14', 11],
                ['2024-06-15', 12]
            ],
            keys: ['x', 'y']
        }],
        xAxis: {
            type: 'datetime',
            min: '2024-06-10',
            max: '2024-06-12',
            minPadding: 0,
            maxPadding: 0
        }
    });

    assert.deepEqual(
        [chart.xAxis[0].min, chart.xAxis[0].max],
        [Date.UTC(2024, 5, 10), Date.UTC(2024, 5, 12)],
        'Min and max should be parsed as UTC time'
    );

    chart.xAxis[0].update({
        minRange: 5 * 24 * 3600 * 1000
    });

    assert.deepEqual(
        [chart.xAxis[0].min, chart.xAxis[0].max],
        [Date.UTC(2024, 5, 10), Date.UTC(2024, 5, 12)],
        'Min and max should override minRange'
    );

    chart.xAxis[0].update({
        minRange: 1 * 24 * 3600 * 1000
    });

    chart.xAxis[0].setExtremes('2024-06-11', '2024-06-13');

    assert.deepEqual(
        [chart.xAxis[0].min, chart.xAxis[0].max],
        [Date.UTC(2024, 5, 11), Date.UTC(2024, 5, 13)],
        'setExtremes should parse the strings as UTC time'
    );

});
