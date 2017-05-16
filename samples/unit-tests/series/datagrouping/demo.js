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
