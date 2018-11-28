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
QUnit.test('Axis.isBroken', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            data: [1, 2, 3, 4]
        }]
    });

    assert.strictEqual(
        chart.xAxis[0].isBroken,
        false,
        'Axis.breaks: undefined results in Axis.isBroken: false.'
    );

    chart.xAxis[0].update({
        breaks: []
    });
    assert.strictEqual(
        chart.xAxis[0].isBroken,
        false,
        'Axis.breaks: [] results in Axis.isBroken: false.'
    );

    chart.xAxis[0].update({
        breaks: [{}]
    });
    assert.strictEqual(
        chart.xAxis[0].isBroken,
        true,
        'Axis.breaks: [{}] results in Axis.isBroken: true.'
    );
});

QUnit.test('Axis breaks with categories', function (assert) {
    var chart = Highcharts.chart('container', {

        xAxis: {
            categories: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],

            breaks: [{
                from: 2.5,
                to: 7.5
            }]
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1]
        }]

    });

    var gridBox = chart.xAxis[0].gridGroup.getBBox();

    assert.strictEqual(
        gridBox.x + 0.5,
        chart.plotLeft,
        'Left tick is left of plot area'
    );
    assert.strictEqual(
        gridBox.width,
        chart.plotWidth,
        'Right tick is right of plot area'
    );


});

QUnit.test('Axis breaks with scatter series', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 600
        },
        "xAxis": {
            "breaks": [{
                "to": 1272240000000,
                "from": 1272067200000
            }]
        },
        "series": [{
            "type": "scatter",
            "data": [
                [
                    1271980800000,
                    0
                ],
                [
                    1272240000000,
                    2
                ],
                [
                    1272326400000,
                    1
                ],
                [
                    1272412800000,
                    5
                ],
                [
                    1272499200000,
                    4
                ]
            ]
        }]
    });

    assert.strictEqual(
        chart.xAxis[0].tickPositions.length,
        4,
        'X axis has ticks (#7275)'
    );

});

QUnit.test('Axis breaks on Y axis', function (assert) {
    var chart = Highcharts.chart('container', {
        yAxis: {
            breaks: [{
                from: 50,
                to: 100,
                breakSize: 0
            }]
        },
        series: [{ data: [0, 49, 101, 150] }]
    });

    assert.strictEqual(
        typeof chart.yAxis[0].toPixels(50),
        'number',
        'Axis to pixels ok'
    );
    assert.strictEqual(
        chart.yAxis[0].toPixels(50),
        chart.yAxis[0].toPixels(100),
        '50 and 100 translate to the same axis position'
    );
});
