QUnit.test('General dataGrouping options', function (assert) {
    var chart = Highcharts.stockChart('container', {
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

        xAxis: {
            min: 1
        },

        series: [{
            dataGrouping: {
                groupAll: true
            },
            data: [
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
            ]
        }, {
            dataGrouping: {
                groupAll: false
            },
            data: [
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
            ]
        }, {
            type: 'scatter',
            data: [[1, 1]]
        }]
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
});

QUnit.test('dataGrouping and keys', function (assert) {
    var chart = Highcharts.stockChart('container', {
        chart: {
            width: 400
        },
        series: [{
            type: 'arearange',
            keys: ['colorIndex', 'x', 'something', 'low', 'y', 'high'],
            data: (function () {
                var arr = [];
                for (var i = 0; i < 999; i++) {
                    arr.push([i % 8, i, 'Something' + i, 100 - i, i % 420, 100 + i]);
                }
                return arr;
            }()),
            dataGrouping: {
                units: [
                    ['millisecond', [10]]
                ]
            }
        }]
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
                    units: [
                        ['millisecond', [10]]
                    ],
                    approximation: 'wrong'
                }
            }
        },
        series: [{
            data: [0, 5, 40]
        }, {
            type: 'column',
            data: [2, 2, 2]
        }, {
            type: 'ohlc',
            data: [[1, 3, 0, 2], [1, 5, 1, 2], [2, 2, 2, 2]]
        }, {
            type: 'arearange',
            dataGrouping: {
                forced: true,
                approximation: 'range',
                units: [
                    ['millisecond', [2]]
                ]
            },
            data: [
                [0, 1, 2],
                [1, 2, 3],
                [2, null, null],
                [3, null, null],
                [4, 2, 3],
                [5, 1, 2]
            ]
        }]
    });

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

});

QUnit.test('dataGrouping and multiple series', function (assert) {
    var realError,
        hadError = false,
        chart = Highcharts.stockChart('container', {
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
                        units: [
                            ['millisecond', [10]]
                        ]
                    }
                }
            },
            series: [{
                data: [0, 5, 40]
            }, {
                data: [2, 2, 2]
            }, {
                type: 'scatter',
                data: [
                    [2, 7],
                    [0, 7]
                ]
            }]
        }, function () {
            // clean up
            Highcharts.error = realError;
        });

    assert.ok(
        !hadError,
        'No Highcharts error (#6989)'
    );

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
        series: [{
            dataGrouping: {
                enabled: true,
                forced: true,
                units: [
                    ['millisecond', [1]]
                ]
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
        }]
    });

    assert.strictEqual(
        chart.series[0].processedXData.join(','),
        '80,85,90',
        'Preserve X positions for shoulder points'  // keyword: cropShoulder
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
            buttons: [{
                type: 'month',
                count: 1,
                text: 'Dayly',
                dataGrouping: {
                    forced: true,
                    units: [
                        ['day', [1]]
                    ]
                }
            }, {
                text: 'Monthly',
                type: 'month',
                count: 12,
                dataGrouping: {
                    forced: true,
                    units: [
                        ['month', [1]]
                    ]
                }
            }],
            selected: 1
        },
        series: [{
            name: 'AAPL',
            data: (function () {
                var arr = [];
                var y = 0;
                for (var x = Date.UTC(2017, 0, 1); x < Date.UTC(2018, 0, 1); x += 24 * 36e5) {
                    arr.push([
                        x,
                        y++ % 14
                    ]);
                }
                return arr;
            }()),
            type: 'column'
        }],
        navigator: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        }
    });

    assert.strictEqual(
        chart.container.querySelectorAll('.highcharts-series-0 rect').length,
        12,
        'Monthly columns'
    );

    chart.rangeSelector.clickButton(0);
    assert.strictEqual(
        chart.container.querySelectorAll('.highcharts-series-0 rect').length,
        32,
        'Daily columns, monthlies should be removed (#7547) (Timezone: UTC ' +
        Math.round((new Date()).getTimezoneOffset() / -60) + ')'
    );

});

QUnit.test('Data groupind and extremes change', function (assert) {
    var min = 0,
        chart = Highcharts.stockChart('container', {
            xAxis: {
                min: min,
                ordinal: false
            },
            series: [{
                pointStart: 12 * 3600 * 1000 + 15,
                dataGrouping: {
                    forced: true
                },
                pointInterval: 12 * 3600 * 1000,
                data: [73, 0, 0, 1, 2, 0, 0, 0, 12]
            }]
        });

    assert.strictEqual(
        chart.xAxis[0].getExtremes().min,
        min,
        'User defined minimum is applied on a chart (#8335).'
    );
});

QUnit.test('Data groupind, keys and turboThreshold', function (assert) {
    var chart = Highcharts.stockChart('container', {
        series: [{
            keys: ['x', 'a', 'y'],
            turboThreshold: 1,
            dataGrouping: {
                forced: true
            },
            data: (function () {
                var d = [];

                for (var i = 0; i < 10; i++) {
                    d.push([
                        i, 10, 1000
                    ]);
                }

                return d;
            }())
        }]
    });

    assert.strictEqual(
        chart.series[0].yData[0],
        1000,
        'Correct yData (#8544).'
    );
});

QUnit.test('Data grouping and adding points with data labels', function (assert) {
    var chart = Highcharts.stockChart('container', {
        series: [{
            dataGrouping: {
                forced: true
            },
            data: [1, 2]
        }]
    });

    chart.series[0].addPoint({ y: 4, dataLabels: { enabled: true } });
    chart.series[0].addPoint({ y: 5, dataLabels: { enabled: true } });

    assert.strictEqual(
        chart.series[0].points.length,
        4,
        'Correct number of points and no errors (#9770).'
    );
});

QUnit.test('Data grouping, custom name in tooltip', function (assert) {
    var chart = Highcharts.stockChart('container', {
        chart: {
            zoomType: 'x'
        },
        xAxis: {
            min: 120,
            max: 125
        },
        series: [{
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
                pointFormat: 'name: {point.name} <br>' +
                'myName: {point.myName} <br>' +
                'x: {point.x}'
            },
            dataGrouping: {
                forced: true,
                units: [
                    [
                        'millisecond', [1]
                    ]
                ]
            }
        }]
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
