QUnit.test('series.colors: default to colors.', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [{
                type: 'sunburst',
                data: [1, 2]
            }]
        }),
        series = chart.series[0];
    // TODO chart.colors could be copied explicitly onto the series object.
    // assert.deepEqual(
    //     series.options.colors,
    //     chart.options.colors,
    //     'series.colors is the same as chart.colors'
    // );
    assert.strictEqual(
        series.options.colors,
        undefined,
        'series.colors is undefined'
    );
});

QUnit.test('series.colors: custom colors.', assert => {
    const chartColors = ['#00ffff', '#ff00ff', '#ffff00'];
    const seriesColors = ['#ff0000', '#00ff00', '#0000ff'];
    const { series: [series] } = Highcharts.chart('container', {
        colors: chartColors,
        series: [{
            colorByPoint: true,
            type: 'sunburst',
            data: [1, 2, 3]
        }]
    });
    assert.deepEqual(
        series.points.map(point => point.color),
        chartColors,
        'series.points[].colors equals chart.colors when series.colors not set.'
    );

    // Set series.colors
    series.update({
        colors: seriesColors
    });
    assert.deepEqual(
        series.points.map(point => point.color),
        seriesColors,
        'series.points[].colors equals series.colors.'
    );
});