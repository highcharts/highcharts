QUnit.test(
    'Axis breaks and column width in Highstock (#5979)',
    function (assert) {
        var data = [];
        for (
            var x = Date.UTC(2010, 0, 8), y = 1;
            x < Date.UTC(2010, 1, 22);
            x += 24 * 36e5, y++
        ) {
            if (y % 7 !== 2 && y % 7 !== 3) {
                data.push([x, y]);
            }
        }

        var chart = Highcharts.stockChart('container', {
            xAxis: {
                ordinal: false,
                type: 'datetime',
                breaks: [{
                    from: Date.UTC(2010, 6, 30, 0, 0, 0),
                    to: Date.UTC(2010, 6, 31, 21, 59, 59),
                    repeat: 7 * 24 * 36e5
                }]
            },
            series: [{
                type: 'column',
                data: data,
                animation: false
            }]
        });

        assert.ok(
            chart.series[0].points[0].graphic.attr('width') > 7,
            'Width is great enough'
        );

    }
);
