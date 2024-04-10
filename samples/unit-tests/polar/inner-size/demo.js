QUnit.test('(#12850) Inner size of pane.', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                type: 'column',
                polar: true
            },
            pane: {
                size: '100%'
            },
            yAxis: {
                max: 5,
                tickInterval: 1
            },
            plotOptions: {
                series: {
                    borderWidth: 0
                }
            },
            series: [
                {
                    data: [0, 1, 2, 3, 4, 5]
                }
            ]
        }),
        series = chart.series[0],
        xAxis = series.xAxis,
        yAxis = series.yAxis;

    assert.strictEqual(
        series.points[0].rectPlotY,
        yAxis.len,
        'The first point\'s is in a correct place.'
    );

    assert.strictEqual(
        series.points[5].rectPlotY,
        0,
        'The sixth point\'s is in a correct place.'
    );

    chart.pane[0].update({
        innerSize: '20%'
    });

    assert.strictEqual(
        yAxis.len.toFixed(1),
        yAxis.translate(yAxis.max).toFixed(1),
        'The yAxis length should related to the max value'
    );

    assert.ok(xAxis.pane.center[3] / 2, 'The innerSize is set.');

    chart.pane[0].update({
        innerSize: -100
    });

    assert.strictEqual(
        xAxis.pane.center[3] / 2,
        0,
        'The inner size is not negative.'
    );
});
