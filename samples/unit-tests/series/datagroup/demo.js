

QUnit.test('Point dataGroup', function (assert) {
    var chart = Highcharts.stockChart('container', {
        chart: {
            width: 400
        },
        series: [{
            pointStart: Date.UTC(2016, 0, 1),
            pointInterval: 24 * 36e5,
            data: (function () {
                var arr = [];
                for (var i = 0; i < 3 * 365; i++) {
                    arr.push(i);
                }
                return arr;
            }())
        }],
        navigator: {
            enabled: false
        }
    });

    assert.strictEqual(
        chart.series[0].points[0].dataGroup.start,
        0,
        'First group starts at 0'
    );

    assert.strictEqual(
        chart.series[0].points[0].dataGroup.length,
        3,
        'First group includes 3 points'
    );
});