
QUnit.test('Show-hide series', function (assert) {

    var chart =  Highcharts.stockChart('container',
        {
            rangeSelector: {
                selected: 1
            },
            series: [{
                name: 'USD to EUR',
                data: usdeur
            }]
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
