QUnit.test('Price indicator.', function (assert) {

    var chart = Highcharts.stockChart('container', {
            xAxis: {
                min: 1184663400000,
                max: 1284663400000
            },
            series: [{
                lastPrice: {
                    enabled: true,
                    color: 'red'
                },
                lastVisiblePrice: {
                    enabled: true,
                    label: {
                        enabled: true
                    }
                },
                type: 'candlestick',
                data: [
                    [1484663400000, 118.34, 120.24, 118.22, 120],
                    [1484749800000, 120, 120.5, 119.71, 119.99],
                    [1484836200000, 119.4, 120.09, 119.37, 119.78]
                ]
            }]
        }),
        series = chart.series[0];

    assert.strictEqual(
        series.points.length === 0 && series.lastPrice === undefined,
        true,
        'No errors when points are missing.'
    );
});
