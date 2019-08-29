var correctFloat = Highcharts.correctFloat,
    getData = function () {
        var data = [],
            i;

        for (i = 0; i < 1000; i++) {
            data.push([
                (+new Date()) + i * 3600,
                153 + correctFloat(Math.random(0, 1), 2),
                153 + correctFloat(Math.random(0, 1), 2),
                153 + correctFloat(Math.random(0, 1), 2),
                153 + correctFloat(Math.random(0, 1), 2)
            ]);
        }

        return data;
    };

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

QUnit.test('Datagrouping and setExtremes.', function (assert) {

    var chart = Highcharts.stockChart('container', {
            rangeSelector: {
                selected: 5
            },
            series: [{
                type: 'candlestick',
                dataGrouping: {
                    enabled: true
                },
                lastVisiblePrice: {
                    enabled: true,
                    label: {
                        enabled: true
                    }
                },
                lastPrice: {
                    enabled: true,
                    color: 'red'
                },
                data: getData()
            }]
        }),
        series = chart.series[0];

    assert.strictEqual(
        series.points[series.points.length - 1].y,
        series.lastVisiblePrice.y,
        'Indicator should show the close value of the last grouped point.'
    );

    var min = chart.xAxis[0].min,
        max = min + 100 * 3600;

    chart.xAxis[0].setExtremes(min, max);

    assert.strictEqual(
        series.points[series.points.length - 1].y,
        series.lastVisiblePrice.y,
        'Indicator should show the close value of the last non-grouped point.'
    );
});
