QUnit.test('yAxis', function (assert) {
    var chart = Highcharts.stockChart('container', {
        chart: {
            type: 'candlestick'
        },
        yAxis: [
            {
                height: '50%'
            },
            {
                height: '50%',
                top: '50%',
                reversed: true
            }
        ],
        series: [
            {
                keys: ['x', 'open', 'high', 'low', 'close', 'name'],
                data: [
                    [0, 10, 20, 5, 10, '"open === close"'],
                    [1, 10, 20, 5, 15, '"open < close"'],
                    [2, 10, 15, 5, 5, '"open > close"'],
                    [3, 10, 10, 10, 10, '"flat candle"'],
                    [4, 15, 15, 10, 10, '"without whiskers"']
                ]
            },
            {
                yAxis: 1,
                data: [
                    [0, 10, 20, 5, 10],
                    [1, 10, 20, 5, 15],
                    [2, 10, 15, 5, 5],
                    [3, 10, 10, 10, 10],
                    [4, 15, 15, 10, 10]
                ]
            }
        ]
    });

    chart.series[0].points.forEach((point, index) => {
        var bbox = point.graphic.getBBox(),
            bboxReversed = chart.series[1].points[index].graphic.getBBox();

        assert.close(
            bbox.height,
            bboxReversed.height,
            2,
            'Reversed yAxis: Point ' +
                point.name +
                ' has correct height when (#3777).'
        );
    });
});
