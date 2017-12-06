QUnit.test('Flag values and placement', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                data: [1, 0, 1],
                id: 's1'
            }, {
                type: 'flags',
                shape: 'circlepin',
                stackDistance: 20,
                onSeries: 's1',
                data: (function (n) {
                    var d = [],
                        i = n;
                    while (i--) {
                        d.push({
                            x: 1,
                            title: n - i
                        });
                    }
                    return d;
                }(11))
            }],
            yAxis: [{
                min: 0
            }]
        }),
        series = chart.series[1];

    assert.strictEqual(
        (function (s) {
            var ret = true,
                data = s.data,
                points = s.points,
                len = s.data.length;
            for (var i = 0; i < len; i++) {
                if (data[i].index !== points[i].index) {
                    ret = false;
                    i = len; // quit
                }
            }
            return ret;
        }(series)),
        true,
        'Order of points shoule be the same as data (#3763)'
    );

    assert.strictEqual(
        chart.series[1].points[0].y,
        0,
        'The flag point should have the same Y as the onSeries (#7440)'
    );

    chart.series[1].addPoint({
        x: 1.5
    });

    assert.strictEqual(
        chart.series[1].points[11].y,
        0.5,
        'The interpolated flag should have an interpolated Y value (#7440)'
    );
});