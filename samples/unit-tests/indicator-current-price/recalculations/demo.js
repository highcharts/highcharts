QUnit.test('Test current and last price indicator.', function (assert) {

    var chart = Highcharts.stockChart('container', {
        series: [{
            type: 'line',
            data: [10, 5, 30, 10, 20, 15, 20, 20, 1, 2, 30, 12, 22],
            lastPrice: {
                enabled: true,
                color: 'red'
            },
            lastVisiblePrice: {
                enabled: true,
                label: {
                    enabled: true
                }
            }
        }]
    });

    assert.strictEqual(
        chart.series[0].lastPrice.y && chart.series[0].lastVisiblePrice.y,
        22,
        'The last label and line are correct.'
    );

    chart.xAxis[0].setExtremes(0, 2);

    assert.strictEqual(
        chart.series[0].lastPrice.y,
        22,
        'The last price is correct.'
    );

    assert.strictEqual(
        chart.series[0].lastVisiblePrice.y,
        15,
        'The last visible price is correct.'
    );
});
