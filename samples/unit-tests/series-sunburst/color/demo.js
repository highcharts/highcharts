QUnit.test('series.color: default to series.colors[0].', function (assert) {
    const H = Highcharts,
        chart = H.chart('container', {
            series: [
                {
                    type: 'sunburst',
                    data: [1, 2]
                }
            ]
        }),
        color = chart.options.colors[0],
        series = chart.series[0];
    assert.strictEqual(
        series.color,
        color,
        'The series object has the property color with value of ' + color + '.'
    );
    const result = !!H.find(series.points, function (p) {
        return p.color !== color;
    });
    assert.strictEqual(
        result,
        false,
        'All points in the series has the property color with value of ' +
            color +
            '.'
    );
});

QUnit.test('series.color: custom color.', function (assert) {
    const H = Highcharts,
        color = '#ff0000',
        chart = H.chart('container', {
            series: [
                {
                    type: 'sunburst',
                    color: color,
                    data: [1, 2]
                }
            ]
        }),
        series = chart.series[0];
    assert.strictEqual(
        series.color,
        color,
        'The series object has the property color with value of ' + color + '.'
    );
    const result = !H.find(series.points, function (p) {
        return p.color !== color;
    });
    assert.strictEqual(
        result,
        true,
        'All points in the series has the property color with value of ' +
            color +
            '.'
    );

    chart.update({
        chart: {
            inverted: true
        }
    });

    assert.strictEqual(
        chart.series[0].group.rotationOriginX,
        0,
        `#17168, sunburst shouldn't have any rotation, when the chart is
        inverted.`
    );

    assert.strictEqual(
        chart.series[0].group.rotationOriginY,
        0,
        `#17168, sunburst shouldn't have any rotation, when the chart is
        inverted.`
    );

    assert.notEqual(
        chart.series[0].group.scaleX,
        -1,
        `#17168, sunburst shouldn't be invert scaled, when the chart is
        inverted.`
    );
});
