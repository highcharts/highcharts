/**
 * Related issues: #8406
 */
QUnit.test('getSeriesExtremes', function (assert) {
    var chart = Highcharts.chart('container', {
            colorAxis: {
                minColor: '#ffffff',
                maxColor: Highcharts.getOptions().colors[0]
            },
            series: []
        }),
        series;

    chart.addAxis({ id: 'yAxis' }, false, true);
    series = chart.addSeries({
        type: 'heatmap',
        yAxis: 'yAxis',
        data: [
            [1, 1, 1],
            [1, 2, 2],
            [1, 3, 3]
        ]
    });

    assert.strictEqual(
        series.points[0].color,
        'rgb(255,255,255)',
        'The first point on series should have the minColor'
    );

    assert.strictEqual(
        series.points[1].color,
        'color-mix(in srgb,#ffffff,var(--highcharts-color-0) 50%)',
        'The second point on series should have an interpolated color'
    );

    assert.strictEqual(
        series.points[2].color,
        'var(--highcharts-color-0)',
        'The third point on series should have the maxColor'
    );
});
