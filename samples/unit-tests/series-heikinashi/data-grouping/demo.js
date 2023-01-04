QUnit.test('Heikinashi with data grouping.', function (assert) {
    var chart = Highcharts.stockChart('container', {
            series: [
                {
                    type: 'heikinashi',
                    dataGrouping: {
                        enabled: true,
                        forced: true,
                        groupAll: true,
                        units: [['millisecond', [3]]]
                    },
                    data: [
                        [1, 2, 4, 2, 4],
                        [2, 1, 2, 1, 2],
                        [3, 1, 2, 1, 2],
                        [4, 1, 2, 1, 2],
                        [5, 1, 2, 1, 2],
                        [6, 1, 2, 1, 2],
                        [7, 1, 2, 1, 2],
                        [8, 1, 2, 1, 2],
                        [9, 1, 2, 1, 2],
                        [10, 1, 2, 1, 2],
                        [11, 1, 2, 1, 2],
                        [12, 1, 2, 1, 2],
                        [13, 1, 2, 1, 2],
                        [14, 1, 2, 1, 2],
                        [15, 1, 2, 1, 2]
                    ]
                }
            ]
        }),
        points = chart.series[0].points,
        thirdPointOpen = points[2].open;

    assert.strictEqual(
        points[0].open,
        2.25,
        'Points should be grouped.'
    );
    chart.xAxis[0].setExtremes(5, undefined);
    assert.strictEqual(
        thirdPointOpen,
        chart.series[0].points[1].open,
        `When data grouping enabled, changing the extremes should not
        influence the heikinashi candles.`
    );
});
