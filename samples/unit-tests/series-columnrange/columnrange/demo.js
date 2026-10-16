QUnit.test('Column range and column series.', assert => {
    const container = document.getElementById('container');
    container.style.setProperty('--hc-point-width', '40px');

    const chart = Highcharts.chart(container, {
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
            pointWidth: 'var(--hc-point-width)'
        }, {
            type: 'columnrange',
            pointWidth: 'calc(var(--hc-point-width) / 2)',
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

    assert.strictEqual(
        chart.series[0].points[0].pointWidth,
        40,
        'Column pointWidth should resolve to pixels when set via a CSS ' +
        'variable'
    );

    assert.strictEqual(
        chart.series[1].points[0].pointWidth,
        20,
        'Columnrange pointWidth should resolve to pixels when set via a ' +
        'CSS calc() expression'
    );

    container.style.removeProperty('--hc-point-width');
});
