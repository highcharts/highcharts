/**
 * Related issues: #8406
 */
QUnit.test('getSeriesExtremes', function (assert) {
    var chart = Highcharts.chart("container", {
            colorAxis: {
                minColor: '#ffffff',
                maxColor: Highcharts.getOptions().colors[0]
            },
            series: []
        }),
        series;

    chart.addAxis({ id: "yAxis" }, false, true);
    series = chart.addSeries({
        type: 'heatmap',
        yAxis: 'yAxis',
        data: [[1, 1, 1], [1, 2, 2], [1, 3, 3]]
    });

    assert.strictEqual(
        series.points[0].color,
        'rgb(255,255,255)',
        'should give first point on series the color rgb(255,255,255)'
    );

    assert.strictEqual(
        series.points[1].color,
        'rgb(190,218,246)',
        'should give second point on series the color rgb(190,218,246)'
    );

    assert.strictEqual(
        series.points[2].color,
        'rgb(124,181,236)',
        'should give third point on series the color rgb(124,181,236)'
    );
});