QUnit.test('Column range and column series.', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        plotOptions: {
            columnrange: {
                centerInCategory: true
            },
            series: {
                borderWidth: 0
            }
        },
        series: [{
            data: [2],
            pointWidth: 40
        }, {
            type: 'columnrange',
            pointWidth: 20,
            data: [{
                high: 2,
                low: 1,
                x: 0
            }]
        }]
    });

    assert.ok(true, 'Enabling centerInCategory should not throw');

    assert.strictEqual(
        chart.series[0].points[0].graphic.getBBox().y,
        chart.series[1].points[0].graphic.getBBox().y,
        'Column range points and columns should be aligned, #17912.'
    );
});
