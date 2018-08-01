QUnit.test('Onkey option for flags on OHLC (#6478)', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                id: "a",
                type: 'ohlc',
                data: [
                    [0, 1, 25, -6, 17],
                    [1, 9, 14, -8, 2],
                    [2, 6, 13, -4, 10],
                    [3, 3, 11, -2, 7]
                ]
            }, {
                type: 'flags',
                onSeries: "a",
                onKey: 'open',
                data: [{
                    x: 0,
                    title: "open"
                }]
            }, {
                type: 'flags',
                onSeries: "a",
                onKey: 'high',
                data: [{
                    x: 1,
                    title: "high"
                }]
            }, {
                type: 'flags',
                onSeries: "a",
                onKey: 'low',
                data: [{
                    x: 2,
                    title: "low"
                }]
            }, {
                type: 'flags',
                onSeries: "a",
                onKey: 'close',
                data: [{
                    x: 3,
                    title: "close"
                }]
            }]
        }),
        axis = chart.yAxis[0],
        plotTop = chart.plotTop,
        ohlcPoints = chart.series[0].points,
        series = chart.series;

    Highcharts.each(['open', 'high', 'low', 'close'], function (verb, i) {
        assert.strictEqual(
            series[i + 1].points[0].plotY + plotTop,
            axis.toPixels(ohlcPoints[i][verb]),
            'onkey = "' + verb + '"'
        );
    });
});