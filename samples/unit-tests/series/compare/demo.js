

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