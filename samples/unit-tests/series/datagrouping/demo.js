QUnit.test('General dataGrouping options', function (assert) {
    let calledWithNaN = false;

    var chart = Highcharts.stockChart('container', {
        chart: {
            type: 'column'
        },
        plotOptions: {
            series: {
                dataGrouping: {
                    enabled: true,
                    forced: true,
                    units: [['millisecond', [5]]]
                }
            }
        },

        xAxis: {
            min: 1
        },

        series: [
            {
                dataGrouping: {
                    groupAll: true
                },
                data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            },
            {
                dataGrouping: {
                    groupAll: false
                },
                data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            },
            {
                type: 'scatter',
                data: [[1, 1]]
            },
            {
                type: 'ohlc',
                dataGrouping: {
                    groupAll: true
                },
                data: [
                    [1, 2, 1, 2],
                    [2, 4, 2, 4],
                    [1, 2, 1, 2],
                    [1, 2, 1, 2],
                    [1, 2, 1, 2],
                    [1, 2, 1, 2],
                    [1, 2, 1, 2],
                    [1, 2, 1, 2],
                    [1, 2, 1, 2],
                    [1, 2, 1, 2]
                ]
            },
            {
                type: 'ohlc',
                dataGrouping: {
                    groupAll: false
                },
                data: [
                    [1, 2, 1, 2],
                    [2, 4, 2, 4],
                    [1, 2, 1, 2],
                    [1, 2, 1, 2],
                    [1, 2, 1, 2],
                    [1, 2, 1, 2],
                    [1, 2, 1, 2],
                    [1, 2, 1, 2],
                    [1, 2, 1, 2],
                    [1, 2, 1, 2]
                ]
            },
            {
                data: []
            }
        ],
        time: {
            getTimezoneOffset: timestamp => {
                if (Number.isNaN(timestamp)) {
                    calledWithNaN = true;
                }
                return new Date().getTimezoneOffset();
            }
        }
    });

    assert.ok(
        chart.series[0].points[0].y > 1,
        'Scatter doesn\'t prevent dataGrouping when `plotOptions.series.dataGrouping` is set (#9693)'
    );

    assert.strictEqual(
        chart.series[0].points[0].y,
        5,
        'All points are used to calculate gorups (#5344)'
    );

    assert.strictEqual(
        chart.series[1].points[0].y,
        4,
        'Only visible points are used to calculate gorups (#5344)'
    );

    assert.strictEqual(
        chart.series[3].points[0].open,
        1,
        'All OHLC points are used (#9738)'
    );
    assert.strictEqual(
        chart.series[4].points[0].open,
        2,
        'Only visible OHLC points are used (#9738)'
    );

    assert.notOk(
        calledWithNaN,
        'Empty series should not cause getTimezoneOffset to get called with NaN timestamp (#13247)'
    );

    chart.update({
        chart: {
            width: 10
        },
        plotOptions: {
            series: {
                dataGrouping: {
                    units: void 0
                }
            }
        }
    });

    assert.ok(
        true,
        'No errors when plotSizeX of the chart is zero (#17114).'
    );
});

QUnit.test('dataGrouping and keys', function (assert) {
    var chart = Highcharts.stockChart('container', {
        chart: {
            width: 400
        },
        series: [
            {
                type: 'arearange',
                keys: ['colorIndex', 'x', 'something', 'low', 'y', 'high'],
                data: (function () {
                    var arr = [];
                    for (var i = 0; i < 999; i++) {
                        arr.push([
                            i % 8,
                            i,
                            'Something' + i,
                            100 - i,
                            i % 420,
                            100 + i
                        ]);
                    }
                    return arr;
                }()),
                dataGrouping: {
                    units: [['millisecond', [10]]]
                }
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].points[0].low === 91 &&
            chart.series[0].points[0].high === 109,
        true,
        'data grouped correctly when using keys on data (#6590)'
    );

    assert.strictEqual(
        chart.series[0].points[1].colorIndex,
        2,
        'Non-data properties should be preserved (#8999)'
    );

    assert.strictEqual(
        chart.series[0].points[1].something,
        'Something10',
        'Custom properties should be preserved (#8999)'
    );

    chart.xAxis[0].setExtremes(0, 900);

    assert.strictEqual(
        chart.series[0].points[0].low === 91 &&
            chart.series[0].points[0].high === 109,
        true,
        'data grouped correctly when using keys on data after zoom (#6590)'
    );

    chart.xAxis[0].setExtremes(0, 30);

    assert.strictEqual(
        chart.series[0].points[0].low === 100 &&
            chart.series[0].points[0].high === 100,
        true,
        'not grouped data is correct'
    );
});

QUnit.test('dataGrouping approximations', function (assert) {
    var chart = Highcharts.stockChart('container', {
            chart: {
                width: 400
            },
            plotOptions: {
                series: {
                    dataGrouping: {
                        forced: true,
                        units: [['millisecond', [10]]],
                        approximation: 'wrong'
                    }
                }
            },
            series: [
                {
                    data: [0, 5, 40]
                },
                {
                    type: 'column',
                    data: [2, 2, 2]
                },
                {
                    type: 'ohlc',
                    data: [
                        [1, 3, 0, 2],
                        [1, 5, 1, 2],
                        [2, 2, 2, 2]
                    ]
                },
                {
                    type: 'arearange',
                    dataGrouping: {
                        forced: true,
                        approximation: 'range',
                        units: [['millisecond', [2]]]
                    },
                    data: [
                        [0, 1, 2],
                        [1, 2, 3],
                        [2, null, null],
                        [3, null, null],
                        [4, 2, 3],
                        [5, 1, 2]
                    ]
                }
            ]
        }),
        newSeries;

    assert.strictEqual(
        chart.series[0].points[0].y === 15 &&
            chart.series[1].points[0].y === 6 &&
            chart.series[2].points[0].high === 5,
        true,
        'wrong approximation - fallback to series default (#2914)'
    );
    assert.strictEqual(
        chart.series[3].points[1].isNull,
        true,
        '"range" approximation should return nulls when all points in a group are nulls (#6716).'
    );

    newSeries = chart.addSeries({
        type: 'line',
        showInNavigator: true,
        pointInterval: 13000,
        data: (function () {
            var arr = [];

            for (var i = 0; i < 999; i++) {
                arr.push(52.218);
            }

            return arr;
        }()),
        dataGrouping: {
            approximation: 'average',
            units: [['second', [30]]]
        }
    });

    assert.strictEqual(
        newSeries.navigatorSeries.points.filter(p => p.y === 52.218).length,
        newSeries.navigatorSeries.points.length,
        'All points should have the same average value (#11191).'
    );
});

QUnit.test('dataGrouping and multiple series', function (assert) {
    var realError,
        hadError = false,
        chart = Highcharts.stockChart(
            'container',
            {
                chart: {
                    width: 400,
                    type: 'column',
                    events: {
                        beforeRender: function () {
                            realError = Highcharts.error;
                            Highcharts.error = function () {
                                hadError = true;
                            };
                        }
                    }
                },
                plotOptions: {
                    column: {
                        dataGrouping: {
                            forced: true,
                            units: [['millisecond', [10]]]
                        }
                    }
                },
                series: [
                    {
                        data: [0, 5, 40]
                    },
                    {
                        data: [2, 2, 2]
                    },
                    {
                        type: 'scatter',
                        data: [
                            [2, 7],
                            [0, 7]
                        ]
                    }
                ]
            },
            function () {
                // clean up
                Highcharts.error = realError;
            }
        );

    assert.ok(!hadError, 'No Highcharts error (#6989)');

    chart.series[1].hide();
    assert.ok(
        chart.series[1].points === null,
        'Points array is nullified for a hidden series. Hidden series shouldn\'t have `undefined`-points in a series.points array (#6709).'
    );
});

QUnit.test('Data grouping and shoulder values (#4907)', function (assert) {
    var chart = Highcharts.stockChart('container', {
        xAxis: {
            type: 'datetime',
            ordinal: false,
            min: 84,
            max: 86
        },
        navigator: {
            enabled: false
        },
        series: [
            {
                dataGrouping: {
                    enabled: true,
                    forced: true,
                    units: [['millisecond', [1]]]
                },
                marker: {
                    enabled: true
                },
                data: [
                    [1, 1],
                    [2, 2],
                    [80, 3],
                    [85, 4],
                    [90, 5]
                ]
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].processedXData.join(','),
        '80,85,90',
        'Preserve X positions for shoulder points' // keyword: cropShoulder
    );
});

QUnit.test('Switch from grouped to non-grouped', function (assert) {
    var chart = Highcharts.stockChart('container', {
        chart: {
            width: 600,
            height: 250
        },
        rangeSelector: {
            allButtonsEnabled: true,
            buttons: [
                {
                    type: 'month',
                    count: 1,
                    text: 'Dayly',
                    dataGrouping: {
                        forced: true,
                        units: [['day', [1]]]
                    }
                },
                {
                    text: 'Monthly',
                    type: 'month',
                    count: 12,
                    dataGrouping: {
                        forced: true,
                        units: [['month', [1]]]
                    }
                }
            ],
            selected: 1
        },
        series: [
            {
                name: 'AAPL',
                data: (function () {
                    var arr = [];
                    var y = 0;
                    for (
                        var x = Date.UTC(2017, 0, 1);
                        x < Date.UTC(2018, 0, 1);
                        x += 24 * 36e5
                    ) {
                        arr.push([x, y++ % 14]);
                    }
                    return arr;
                }()),
                type: 'column'
            }
        ],
        navigator: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        }
    });

    assert.strictEqual(
        chart.container.querySelectorAll('.highcharts-series-0 path').length,
        12,
        'Monthly columns'
    );

    const series = chart.addSeries({ data: chart.series[0].options.data });
    assert.deepEqual(
        series.currentDataGrouping,
        chart.series[0].currentDataGrouping,
        '#15512: Datagrouping from range selector should be used'
    );

    chart.rangeSelector.clickButton(0);
    assert.strictEqual(
        chart.container.querySelectorAll('.highcharts-series-0 path').length,
        32,
        'Daily columns, monthlies should be removed (#7547) (Timezone: UTC ' +
            Math.round(new Date().getTimezoneOffset() / -60) +
            ')'
    );
});

QUnit.test('Switch from non-grouped to grouped', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 50, // So small to keep the data samle small and fast
            marginLeft: 0,
            marginRight: 0
        },
        series: [
            {
                dataGrouping: {
                    enabled: true
                },
                data: [
                    [1556578800000, 0.006],
                    [1556665200000, 0.002],
                    [1556751600000, 0.003],
                    [1556838000000, 0.001],
                    [1556924400000, 0.002],
                    [1557010800000, 0.002],
                    [1557097200000, 0.002],
                    [1557183600000, 0.002],
                    [1557270000000, 0.002],
                    [1557356400000, 0.003],
                    [1557442800000, 0.002],
                    [1557529200000, 0.002],
                    [1557615600000, 0.001],
                    [1557702000000, 0],
                    [1557788400000, 0],
                    [1557874800000, 0],
                    [1557961200000, 0]
                ]
            }
        ]
    });

    assert.notOk(
        chart.series[0].hasGroupedData,
        'The chart should not have grouped data initially'
    );

    chart.series[0].update({
        data: (() => {
            var arr = [],
                i = 0;
            for (; i < 200; i++) {
                arr.push([Date.UTC(2019, 3, 30, 23, i * 10), i]);
            }
            return arr;
        })()
    });

    assert.ok(
        chart.series[0].hasGroupedData,
        'The chart should have grouped data after update'
    );

    assert.strictEqual(
        chart.container.querySelectorAll('.highcharts-markers path').length,
        0,
        'After series update no old markers should be left on the chart (#10745)'
    );
});

QUnit.test('Data grouping and extremes change', function (assert) {
    var min = 0,
        chart = Highcharts.stockChart('container', {
            xAxis: {
                min: min,
                ordinal: false
            },
            series: [
                {
                    pointStart: 12 * 3600 * 1000 + 15,
                    dataGrouping: {
                        forced: true
                    },
                    pointInterval: 12 * 3600 * 1000,
                    data: [73, 0, 0, 1, 2, 0, 0, 0, 12]
                }
            ]
        }),
        series = chart.series[0],
        controller = new TestController(chart),
        expectedMin,
        expectedMax;

    function panTo(side, x, y, change) {
        const sign = side === 'left' ? 1 : -1;

        controller.mouseDown(x, y);
        controller.mouseMove(x + sign * change, y);
        controller.mouseUp(x + sign * change, y);
    }

    assert.strictEqual(
        chart.xAxis[0].getExtremes().min,
        min,
        'User defined minimum is applied on a chart (#8335).'
    );

    chart.xAxis[0].update({
        min: null,
        minPadding: 0.1
    });

    series.setData([
        [26179200000, 0],
        [28771200000, 1],
        [1285804800000, 479],
        [1288483200000, 480]
    ]);

    assert.strictEqual(
        chart.xAxis[0].getExtremes().min < series.points[0].x,
        true,
        'minPadding should decrease xAxis.min even when points are grouped (#10932).'
    );

    series.setData(new Array(100).fill(10));
    chart.xAxis[0].setExtremes(
        series.options.pointStart + 5 * series.options.pointInterval,
        series.options.pointStart + 15 * series.options.pointInterval
    );
    expectedMin = chart.xAxis[0].toValue(-30, true);

    panTo('left', series.points[7].plotX, series.points[7].plotY, 30);

    assert.strictEqual(
        chart.xAxis[0].getExtremes().min,
        expectedMin,
        'DataGrouping should not prevent panning to the LEFT (#12099)'
    );

    expectedMin = chart.xAxis[0].toValue(30, true);

    panTo('right', series.points[7].plotX, series.points[7].plotY, 30);

    assert.strictEqual(
        chart.xAxis[0].getExtremes().min,
        expectedMin,
        'DataGrouping should not prevent panning to the RIGHT (#12099)'
    );

    chart.xAxis[0].setExtremes(null, null); // reset old extremes

    chart.update({
        xAxis: {
            ordinal: true
        },
        series: [
            {
                data: usdeur // dataset must have gaps and datagrouping
            }
        ]
    });

    chart.xAxis[0].setExtremes(chart.xAxis[0].toValue(200, true), null);

    expectedMax = chart.xAxis[0].max;
    panTo('left', series.points[150].plotX, series.points[7].plotY, 30);

    assert.ok(
        chart.xAxis[0].getExtremes().max !== expectedMax,
        'DataGrouping should not prevent panning to the LEFT (#12099)'
    );

    panTo('right', series.points[150].plotX, series.points[7].plotY, 30);

    assert.strictEqual(
        chart.xAxis[0].getExtremes().max,
        expectedMax,
        'DataGrouping should not prevent panning to the RIGHT (#12099)'
    );
});

QUnit.test('Data grouping, keys and turboThreshold', function (assert) {
    var chart = Highcharts.stockChart('container', {
        series: [
            {
                keys: ['x', 'a', 'y'],
                turboThreshold: 1,
                dataGrouping: {
                    forced: true
                },
                data: (function () {
                    var d = [];

                    for (var i = 0; i < 10; i++) {
                        d.push([i, 10, 1000]);
                    }

                    return d;
                }())
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].yData[0],
        1000,
        'Correct yData (#8544).'
    );
});

QUnit.test(
    'Data grouping and adding points with data labels',
    function (assert) {
        var chart = Highcharts.stockChart('container', {
            series: [
                {
                    dataGrouping: {
                        forced: true
                    },
                    data: [1, 2]
                }
            ]
        });

        chart.series[0].addPoint({ y: 4, dataLabels: { enabled: true } });
        chart.series[0].addPoint({ y: 5, dataLabels: { enabled: true } });

        assert.strictEqual(
            chart.series[0].points.length,
            4,
            'Correct number of points and no errors (#9770).'
        );
    }
);

QUnit.test('Data grouping, custom name in tooltip', function (assert) {
    var chart = Highcharts.stockChart('container', {
        chart: {
            zoomType: 'x'
        },
        xAxis: {
            min: 120,
            max: 125
        },
        series: [
            {
                name: 'AAPL',
                data: (function () {
                    var data = [];

                    for (var i = 0; i < 255; i++) {
                        data.push({
                            x: i,
                            y: i,
                            name: 'a' + i
                        });
                    }
                    return data;
                }()),
                tooltip: {
                    pointFormat:
                        'name: {point.name} <br>' +
                        'myName: {point.myName} <br>' +
                        'x: {point.x}'
                },
                dataGrouping: {
                    forced: true,
                    units: [['millisecond', [1]]]
                }
            }
        ]
    });

    chart.tooltip.refresh([chart.series[0].points[2]]);

    assert.strictEqual(
        chart.tooltip.tt.text.textStr.indexOf('a121') > -1,
        true,
        'Custom name in label is correct (#9928).'
    );

    assert.strictEqual(
        chart.series[0].points[0].dataGroup.start,
        chart.series[0].points[0].x,
        'dataGroup should consider crop start'
    );
});

QUnit.test('DataGrouping with selected range and update', function (assert) {
    const chart = Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 0,
            buttons: [{
                type: 'all',
                text: 'All',
                dataGrouping: {
                    forced: true,
                    units: [
                        ['millisecond', [3]]
                    ]
                }
            }]
        },
        series: [
            {
                id: 'usdeur',
                dataGrouping: {
                    forced: true,
                    approximation: () => 3
                },
                data: [1, 2, 3, 4, 5, 6]
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].points[0].y,
        3,
        `When the scope is set in the dataGrouping options
        it should work as well as without it (#16759)`
    );

    chart.update(
        {
            series: [
                {
                    id: 'usdeur',
                    data: [6, 5, 4, 3, 2, 1]
                },
                {
                    id: 'eurusd',
                    data: [1, 2, 3, 4, 5, 6]
                }
            ]
        },
        true,
        true
    );

    assert.ok(
        true,
        `Should be no errors when:
            - updating one-to-one with IDs
            - DG enabled
        (#11471)`
    );
});

QUnit.test('When groupAll: true, group point should have the same start regardless of axis extremes, #15005.', function (assert) {
    const chart = Highcharts.stockChart('container', {
            chart: {
                type: 'column'
            },
            plotOptions: {
                series: {
                    dataGrouping: {
                        enabled: true,
                        forced: true,
                        units: [
                            ['millisecond', [5]]
                        ]
                    }
                }
            },
            series: [{
                dataGrouping: {
                    groupAll: true
                },
                data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            }, {
                data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            }]
        }),
        groupAllFirstGroupStart = chart.series[0].points[0].dataGroup.start,
        groupAllSecondGroupStart = chart.series[0].points[1].dataGroup.start,
        firstGroupStart = chart.series[1].points[0].dataGroup.start,
        secondGroupStart = chart.series[1].points[1].dataGroup.start;

    assert.strictEqual(
        firstGroupStart,
        0,
        'When the groupAll: false, and all points visible, the first group should start from the beginning (0).'
    );

    chart.xAxis[0].setExtremes(1);

    assert.strictEqual(
        groupAllFirstGroupStart,
        chart.series[0].points[0].dataGroup.start,
        'When the groupAll: true, the start of the group should not be changed after changing extremes.'
    );
    assert.strictEqual(
        groupAllSecondGroupStart,
        chart.series[0].points[1].dataGroup.start,
        'When the groupAll: true, the start of the group should not be changed after changing extremes.'
    );
    assert.strictEqual(
        chart.series[1].points[0].dataGroup.start,
        1,
        'When the groupAll: false, and after changing extremes, the group start should be increased.'
    );
    assert.strictEqual(
        secondGroupStart,
        chart.series[1].points[1].dataGroup.start,
        'When the groupAll: false, and new extremes don\t influence the group, the start should not be changed.'
    );

    // Change the data set to check the group start,
    // when the extremes overlap with the point x.
    chart.series[0].update({
        type: 'line',
        dataGrouping: {
            groupAll: true,
            units: [
                ['minute', [5]]
            ]
        },
        data: [
            [1610028057000, 0.25],
            [1610033040000, 0.80125],
            [1610118031000, 0.8475],
            [1610118209000, 0.8475],
            [1610118426000, 0.8475],
            [1610118691000, 0.8475],
            [1610120241000, 0.8475],
            [1610372248000, 0.8325],
            [1610373264000, 0.83],
            [1610373445000, 0.8275],
            [1610384401000, 0.835],
            [1610384401000, 0.835],
            [1610392040000, 0.375],
            [1610719978000, 0.915],
            [1610720025000, 0.915],
            [1610724043000, 0.91],
            [1610724275000, 0],
            [1610725033000, 0.9],
            [1610725069000, 0.9],
            [1610729723000, 0],
            [1611071398000, 0.84375],
            [1611138383000, 0.835],
            [1611159135000, 0.77],
            [1611162097000, 0.7825],
            [1611162097000, 0.7825]
        ]
    }, false);
    chart.series[1].remove();

    const point = chart.series[0].points[10],
        pointX = point.x;

    assert.strictEqual(
        point.dataGroup.start,
        12,
        'When groupAll: true, this point group should start from 12.'
    );

    chart.xAxis[0].setExtremes(1610033050000);
    assert.strictEqual(
        pointX,
        chart.series[0].points[9].x,
        'The same point should be selected as previously.'
    );
    assert.strictEqual(
        chart.series[0].points[9].dataGroup.start,
        12,
        `When groupAll: true, after changing extremes,
        the point should have the same start.`
    );

    chart.xAxis[0].setExtremes(1610033040000);
    assert.strictEqual(
        chart.series[0].points[9].dataGroup.start,
        12,
        `When groupAll: true, after changing extremes to the same as other
        point x, the groups should not change the start property.`
    );
});

QUnit.test('Panning with dataGrouping and ordinal axis, #3825.', function (assert) {
    const chart = Highcharts.stockChart('container', {
        xAxis: {
            ordinal: true
        },
        rangeSelector: {
            selected: 3
        },
        series: [{
            data: usdeur,
            dataGrouping: {
                forced: true,
                groupAll: true,
                units: [['day', [1]]]
            }
        }]
    });
    // Call function responsible for calculating positions of invisible points while panning.
    chart.xAxis[0].ordinal.getExtendedPositions();

    const positions = chart.xAxis[0].ordinal.positions,
        positionsLength = positions.length,
        index = chart.xAxis[0].ordinal.index,
        indexArray = index[Object.keys(index)[0]],
        indexLength = indexArray.length,
        splicedIndex = // get data for current extremes
            indexArray.splice(indexLength - positionsLength, positionsLength);

    assert.deepEqual(
        positions,
        splicedIndex,
        `When the ordinal axis and data grouping enabled,
        getExtendedPositions should return fake series where
        the data is grouped the same as in the original series.
        Thus each element in the currently visible array of data,
        should equal the corresponding element in the fake series array. `
    );

    chart.series[0].update({
        dataGrouping: {
            units: [['day', [3]]]
        }
    });
    chart.xAxis[0].ordinal.getExtendedPositions();
    assert.ok(
        chart.xAxis[0].ordinal.index[
            Object.keys(chart.xAxis[0].ordinal.index)[1]],
        `After updating data grouping units to an equally spaced (like weeks),
        the ordinal positions should be recalculated- allows panning.`
    );
});

QUnit.test('The dataGrouping enabling/disabling.', function (assert) {
    const chart = Highcharts.stockChart('container', {
        chart: {
            width: 400
        },
        plotOptions: {
            series: {
                dataGrouping: {
                    groupPixelWidth: 50,
                    units: [
                        ['millisecond', [2]]
                    ]
                }
            }
        },
        series: [{
            data: [0, 5, 3, 4]
        }, {
            data: [2, 2, 3, 5, 6, 7, 2, 4, 5, 4, 6, 7, 5, 6]
        }
        ]
    });

    // Grouping each series when the only one requires that, #6765.
    assert.strictEqual(
        chart.series[0].processedXData.length,
        2,
        `Even if the first series doesn't require grouping,
        It should be grouped the same as the second one is.
        Thus only two grouped points should be visible.`
    );

    chart.series[0].remove();

    const series = chart.series[0],
        mapArray = [
            'groupMap',
            'hasGroupedData',
            'currentDataGrouping'
        ];

    // When the dataGrouping is enabled, the properties should exist.
    mapArray.forEach(prop => {
        assert.ok(
            series[prop],
            `When the dataGrouping is enabled,
            the series.${prop} property should be defined.`
        );
    });

    // Set extremes to turn the dataGrouping off
    chart.xAxis[0].setExtremes(0, 5);

    // When the dataGrouping gets off, the properties should be deleted, #16238.
    mapArray.forEach(prop => {
        assert.notOk(
            series[prop],
            `When the dataGrouping gets disabled,
            the series.${prop} property should be deleted.`
        );
    });
});

QUnit.test('Data grouping multiple series on zoom, #17141.', function (assert) {
    const chart = Highcharts.stockChart('container', {
        chart: {
            width: 500
        },
        series: [{
            data: Array.from(Array(5000)).map(() => Math.random() * 10)
        }, {
            data: Array.from(Array(5000)).map(() => Math.random() * 10)
        }]
    });

    chart.xAxis[0].setExtremes(200, 220);
    assert.notOk(
        chart.series[0].hasGroupedData,
        `After zooming to a point where groupinng is no longer needed, it should
        not be applied.`
    );
    assert.notOk(
        chart.series[1].hasGroupedData,
        `After zooming to a point where groupinng is no longer needed, it should
        not be applied.`
    );
});