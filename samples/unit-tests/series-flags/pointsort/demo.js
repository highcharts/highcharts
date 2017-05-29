QUnit.test('Order of flags of the same x position (#3763)', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                data: [1, 0, 1],
                id: 's1'
            }, {
                type: 'flags',
                shape: 'circlepin',
                stackDistance: 20,
                onSeries: 's1',
                data: (function(n) {
                    var d = [], i = n;
                    while(i--) {
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
        (function(s) {
            var ret = true,
                data = s.data,
                points = s.points,
                len = s.data.length;
            for(var i = 0; i < len; i++) {
                if (data[i].index !== points[i].index) {
                    ret = false;
                    i = len; // quit
                }
            }
            return ret;
        }(series)), 
        true, 
        'Order of points the same as data'
    );
});