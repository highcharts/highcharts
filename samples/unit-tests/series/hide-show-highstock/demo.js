QUnit.test('Show-hide series', function (assert) {
    const usdeur = new Array(3000).fill(1).map((item, i) => [
        Date.UTC(2010, 0, 1) + i * 24 * 36e5,
        Math.random()
    ]);

    var chart = Highcharts.stockChart('container', {
            rangeSelector: {
                selected: 1
            },
            yAxis: {
                showEmpty: false
            },
            series: [
                {
                    name: 'USD to EUR',
                    data: usdeur
                }
            ]
        }),
        series = chart.series[0];

    assert.strictEqual(
        series.group.element.getAttribute('visibility'),
        null,
        'Series should be visible and visibility attribute should not be set'
    );
    assert.strictEqual(
        series.yAxis.hasData(),
        true,
        'Series yAxis should be visible'
    );

    // Hide series
    series.hide();
    assert.strictEqual(
        series.group.attr('visibility'),
        'hidden',
        'Series group should be hidden'
    );
    assert.strictEqual(
        series.yAxis.hasData(),
        false,
        'Series yAxis should be hidden'
    );

    // Show series
    series.show();
    assert.strictEqual(
        series.group.element.getAttribute('visibility'),
        null,
        'Series should be visible and visibility attribute should be inherited'
    );
    assert.strictEqual(
        series.yAxis.hasData(),
        true,
        'Series yAxis should be visible'
    );
});
