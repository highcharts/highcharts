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

QUnit.test('series.colors: custom colors.', function (assert) {
    var H = Highcharts,
        colors = ['#ff0000', '#00ff00', '#0000ff'],
        chart = H.chart('container', {
            series: [{
                type: 'sunburst',
                colors: colors,
                data: [1, 2, 3]
            }]
        }),
        series = chart.series[0];
        //result;
    assert.deepEqual(
        series.options.colors,
        colors,
        'series.colors equals custom set colors.'
    );
    // TODO series.colors does not affect series.color
    // assert.strictEqual(
    //     series.color,
    //     colors[0],
    //     'series.color equals series.colors[0].'
    // );
    // result = !H.find(series.points, function (p) {
    //     return p.color !== colors[0];
    // });
    // assert.strictEqual(
    //     result,
    //     true,
    //     'All points in the series has property color with the value of series.colors[0].'
    // );
});