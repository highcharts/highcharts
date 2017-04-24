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
        chart.series[0].points[0].low === 91 && chart.series[0].points[0].high === 109,
        true,
        'data grouped correctly when using keys on data (#6590)'
    );

    chart.xAxis[0].setExtremes(0, 30);

    assert.strictEqual(
        chart.series[0].points[0].low === 100 && chart.series[0].points[0].high === 100,
        true,
        'not grouped data is correct'
    );
});
