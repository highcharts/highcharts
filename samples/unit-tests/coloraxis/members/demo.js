/**
 * Related issues: #8406, #24796
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

    // Marker symbol size and position (#24796)
    chart.update({
        colorAxis: {
            marker: {
                // Read final path synchronously on the second hover
                animation: false,
                symbol: 'circle'
            }
        }
    });

    var axis = chart.colorAxis[0],
        bBox;

    series.points[0].onMouseOver();
    bBox = axis.cross.getBBox();

    assert.close(
        bBox.width,
        axis.height,
        0.1,
        'Horizontal axis: marker width should equal the axis height'
    );
    assert.close(
        bBox.x + bBox.width / 2,
        axis.toPixels(series.points[0].value),
        1,
        'Horizontal axis: marker should be centered on the hovered value'
    );
    assert.close(
        bBox.y,
        axis.top,
        0.1,
        'Horizontal axis: marker should be aligned to the axis top'
    );

    axis.update({ layout: 'vertical' });
    series.points[1].onMouseOver();
    bBox = axis.cross.getBBox();

    assert.close(
        bBox.height,
        axis.width,
        0.1,
        'Vertical axis: marker height should equal the axis width'
    );
    assert.close(
        bBox.y + bBox.height / 2,
        axis.toPixels(series.points[1].value),
        1,
        'Vertical axis: marker should be centered on the hovered value'
    );
    assert.close(
        bBox.x,
        axis.left,
        0.1,
        'Vertical axis: marker should be aligned to the axis left'
    );
});
