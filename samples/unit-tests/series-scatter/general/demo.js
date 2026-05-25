QUnit.test('Scatter series general tests.', function (assert) {
    const chart = Highcharts.chart('container', {
            chart: {
                type: 'scatter'
            },
            series: [
                {
                    lineWidth: 1,
                    data: [
                        [161.2, 51.6],
                        [167.5, 59.0]
                    ]
                }
            ],
            tooltip: {
                formatter: function () {
                    return `${this.index}`;
                }
            }
        }),
        series = chart.series[0],
        tooltip = chart.tooltip,
        tc = new TestController(chart);

    series.update({
        lineWidth: 0
    });
    assert.notOk(
        series.graph,
        'Scatter line should not be visible after lineWidth = 0 update ' +
        '(#13816).'
    );

    series.points[0].onMouseOver();
    assert.notOk(
        series.graph,
        'Scatter line should not be visible when mouse over a point (#13816, ' +
        '#15667).'
    );

    series.setData([
        [0, 0, 5],
        [0, 0, 5]
    ]);

    tc.mouseOver(
        chart.plotLeft + series.points[0].plotX,
        chart.plotTop + series.points[0].plotY
    );

    assert.deepEqual(
        tooltip.label.text.textStr,
        '1',
        'The point with the last index should be highlighted'
    );

    // --- Added tests for #24096 ---
    // 1. Verify Scatter series allows outside plot interaction
    assert.strictEqual(
        series.allowOutsidePlotInteraction,
        true,
        'ScatterSeries should have the allowOutsidePlotInteraction flag set' +
        'to true (#24096).'
    );

    // 2. Add a column series to verify the base Series class fallback
    const columnSeries = chart.addSeries({
        type: 'column',
        data: [1, 2]
    });

    assert.strictEqual(
        columnSeries.allowOutsidePlotInteraction,
        undefined, // Or check for falsy if preferred
        'Default series (Column) should NOT have' +
        'the allowOutsidePlotInteraction flag (#24096).'
    );
});
