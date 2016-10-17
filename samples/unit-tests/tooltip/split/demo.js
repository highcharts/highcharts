QUnit.test('Split Tooltip, hide and show series. #5833', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                data: [1, 2, 3]
            }, {
                data: [3, 2, 1]
            }],
            tooltip: {
                split: true
            }
        }),
        series1 = chart.series[0],
        series2 = chart.series[1],
        p1 = series1.points[0],
        p2 = series2.points[0];

    chart.tooltip.refresh([p1, p2]);
    assert.strictEqual(
        typeof series1.tt,
        'object',
        'series.0 has a tooltip.'
    );


    chart.tooltip.hide();
    series1.hide();
    assert.strictEqual(
        typeof series1.tt,
        'undefined',
        'series.0 tooltip has been destroyed.'
    );

    // Repeat process to test against multiple events #5833
    series1.show();
    assert.strictEqual(
        typeof series1.tt,
        'object',
        'series.0 has a tooltip.'
    );
    series1.hide();
    assert.strictEqual(
        typeof series1.tt,
        'undefined',
        'series.0 tooltip has been destroyed.'
    );
});