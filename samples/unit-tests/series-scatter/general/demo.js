QUnit.test('Scatter series general tests.', function (assert) {
    var chart = Highcharts.chart('container', {
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
            ]
        }),
        series = chart.series[0];

    series.update({
        lineWidth: 0
    });
    assert.notOk(
        series.graph,
        'Scatter line should not be visible after lineWidth = 0 update (#13816).'
    );

    series.points[0].onMouseOver();
    assert.notOk(
        series.graph,
        'Scatter line should not be visible when mouse over a point (#13816, #15667).'
    );
});
