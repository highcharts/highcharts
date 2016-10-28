QUnit.test('tooltip.destroy #5855', function (assert) {
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
        p2 = series2.points[0],
        tooltip = chart.tooltip;
    tooltip.refresh([p1, p2]);
    assert.strictEqual(
        typeof series1.tt,
        'object',
        'series[0].tt is exists'
    );
    assert.strictEqual(
        typeof series2.tt,
        'object',
        'series[1].tt is exists'
    );
    assert.strictEqual(
        typeof tooltip.tt,
        'object',
        'tooltip.tt is exists'
    );


    tooltip.destroy();

    assert.strictEqual(
        series1.tt,
        undefined,
        'series[0].tt is destroyed'
    );
    assert.strictEqual(
        series2.tt,
        undefined,
        'series[1].tt is destroyed'
    );
    assert.strictEqual(
        tooltip.tt,
        undefined,
        'tooltip.tt is destroyed'
    );
});
