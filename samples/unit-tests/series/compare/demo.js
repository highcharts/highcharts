QUnit.test('Compare in candlesticks', function (assert) {
    var chart = Highcharts.stockChart('container', {
        series: [{
            name: 'AAPL',
            type: 'candlestick',
            data: [
                [100, 102, 99, 101],
                [101, 104, 100, 102],
                [102, 104, 100, 101]
            ],
            compare: 'percent'
        }]
    });

    var points = chart.series[0].points,
        yAxis = chart.yAxis[0];


    assert.strictEqual(
        chart.series[0].compareValue,
        points[0].close,
        'Compare by close'
    );
    assert.ok(
        Math.abs(points[2].plotOpen - yAxis.toPixels(1, true)) < 2,
        'Plot open'
    );
    assert.ok(
        Math.abs(points[2].plotHigh - yAxis.toPixels(3, true)) < 2,
        'Plot high'
    );
    assert.ok(
        Math.abs(points[2].yBottom - yAxis.toPixels(-1, true)) < 2,
        'Plot low'
    );
    assert.ok(
        Math.abs(points[2].plotClose - yAxis.toPixels(0, true)) < 2,
        'Plot close'
    );
});

QUnit.test('Compare with one invalid series (#5814)', function (assert) {
    var chart = Highcharts.stockChart('container', {

        plotOptions: {
            series: {
                compare: 'value'
            }
        },

        series: [{
            data: [1, 2, 3, 4]
        }, {
            data: [1, 0, -1, -2]
        }, {
            data: [0, 0, 0, 0]
        }]
    });

    assert.strictEqual(
        typeof chart.series[0].points[0].plotY,
        'number',
        'First point has position'
    );
    assert.strictEqual(
        chart.series[0].points[0].plotY,
        chart.series[1].points[0].plotY,
        'First points overlap'
    );
});

QUnit.test('Compare with the correct compareValue', function (assert) {
    var chart = Highcharts.stockChart('container', {

        plotOptions: {
            series: {
                compare: 'percent'
            }
        },

        series: [{
            type: 'ohlc',
            pointValKey: 'open',
            data: [
                [0, 10, 20, 30, 50],
                [1, 4, 6, 8, 5],
                [3, 60, 5, 12, 2]
            ]
        }]
    });

    var series = chart.series[0];

    assert.strictEqual(
        series.compareValue,
        series.points[0][series.options.pointValKey],
        'compareValue is correct'
    );
});

QUnit.test('Compare to the proper series (#7773)', function (assert) {
    var chart = Highcharts.stockChart('container', {

        plotOptions: {
            series: {
                compare: 'percent'
            }
        },

        tooltip: {
            pointFormat: '{series.name}: {point.y} ({point.change}%)'
        },

        series: [{
            data: [13, 12, 8, 4, 2, 5, 10, 30],
            id: 'main'
        }, {
            type: 'sma',
            name: 'SMA',
            linkedTo: 'main',
            compareToMain: true,
            params: {
                period: 3
            }
        }]
    });

    assert.strictEqual(
        chart.series[1].compareValue,
        13,
        'compareValue is correct'
    );

    assert.strictEqual(
        chart.series[1].data[0].change,
        -15.384615384615387,
        'First change value is correct'
    );
});