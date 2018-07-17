
QUnit.test('Test RSI calculations on data updates.', function (assert) {

    var chart = Highcharts.stockChart('container', {
        yAxis: [{
            height: '48%'
        }, {
            height: '48%',
            top: '52%'
        }],
        series: [{
            id: 'main',
            type: 'candlestick',
            data: [
                [0, 5, 6, 3, 4],
                [1, 5, 6, 3, 4],
                [2, 5, 6, 3, 4],
                [3, 5, 6, 3, 4]
            ]
        }, {
            type: 'rsi',
            yAxis: 1,
            linkedTo: 'main',
            params: {
                period: 3,
                decimals: 2
            }
        }]
    });

    // RSI needs 15 points to calculate period=14 etc.
    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.period,
        'Initial number of RSI points is correct'
    );

    chart.series[0].addPoint([4, 17, 18, 10, 17]);

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.period,
        'After addPoint number of RSI points is correct'
    );

    chart.series[0].setData([
        [430000, 470000, 420000, 443389],
        [430000, 470000, 420000, 440902],
        [430000, 470000, 420000, 441497],
        [430000, 470000, 420000, 436124],
        [430000, 470000, 420000, 443278],
        [430000, 470000, 420000, 448264],
        [430000, 470000, 420000, 450955],
        [430000, 470000, 420000, 454245],
        [430000, 470000, 420000, 458433],
        [430000, 470000, 420000, 460826],
        [430000, 470000, 420000, 458931],
        [430000, 470000, 420000, 460328],
        [430000, 470000, 420000, 456140],
        [430000, 470000, 420000, 462820],
        [430000, 470000, 420000, 462820],
        [430000, 470000, 420000, 460028],
        [430000, 470000, 420000, 460328],
        [430000, 470000, 420000, 464116],
        [430000, 470000, 420000, 462222],
        [430000, 470000, 420000, 456439],
        [430000, 470000, 420000, 462122],
        [430000, 470000, 420000, 462521],
        [430000, 470000, 420000, 457137],
        [430000, 470000, 420000, 464515],
        [430000, 470000, 420000, 457835],
        [430000, 470000, 420000, 453548],
        [430000, 470000, 420000, 440288],
        [430000, 470000, 420000, 441783],
        [430000, 470000, 420000, 442181],
        [430000, 470000, 420000, 445672],
        [430000, 470000, 420000, 434205],
        [430000, 470000, 420000, 426628],
        [430000, 470000, 420000, 431314]
    ], false);
    chart.series[1].update({
        color: 'red',
        params: {
            period: 14,
            decimals: 6
        }
    });

    assert.deepEqual(
        chart.series[1].yData,
        [
            70.532789,
            66.318562,
            66.549830,
            69.406305,
            66.355169,
            57.974856,
            62.929607,
            63.257148,
            56.059299,
            62.377071,
            54.707573,
            50.422774,
            39.989823,
            41.460482,
            41.868916,
            45.463212,
            37.304042,
            33.079523,
            37.772952
        ],
        'Correct values'
    );

    assert.strictEqual(
        chart.series[1].graph.attr('stroke'),
        'red',
        'Line color changed'
    );
    chart.series[0].points[chart.series[0].points.length - 1].remove();

    assert.deepEqual(
        chart.series[1].yData,
        [
            70.532789,
            66.318562,
            66.549830,
            69.406305,
            66.355169,
            57.974856,
            62.929607,
            63.257148,
            56.059299,
            62.377071,
            54.707573,
            50.422774,
            39.989823,
            41.460482,
            41.868916,
            45.463212,
            37.304042,
            33.079523
        ],
        'Correct values after point.remove()'
    );
});
