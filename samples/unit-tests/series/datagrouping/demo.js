
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
        }]
    });

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
            keys: ['nothing', 'x', 'something', 'low', 'y', 'high'],
            data: (function () {
                var arr = [];
                for (var i = 0; i < 999; i++) {
                    arr.push([42, i, -42, 100 - i, i % 420, 100 + i]);
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

QUnit.test('Hidden series shouldn\'t have `undefined`-points in a series.points array (#6709).', function (assert) {
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
                    ]
                }
            }
        },
        series: [{
            data: [0, 5, 40]
        }, {
            type: 'column',
            data: [2, 2, 2]
        }]
    });
    chart.series[1].hide();
    assert.ok(
        chart.series[1].points === null,
        'Points array is nullified for a hidden series.'
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

});
