QUnit.test('series.color: default to series.colors[0].', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [{
                type: 'sunburst',
                data: [1, 2]
            }]
        }),
        color = chart.options.colors[0],
        series = chart.series[0],
        result;
    assert.strictEqual(
        series.color,
        color,
        'The series object has the property color with value of ' + color + '.'
    );
    result = !!H.find(series.points, function (p) {
        return p.color !== color;
    });
    assert.strictEqual(
        result,
        false,
        'All points in the series has the property color with value of ' + color + '.'
    );
});

QUnit.test('series.color: custom color.', function (assert) {
    var H = Highcharts,
        color = '#ff0000',
        chart = H.chart('container', {
            series: [{
                type: 'sunburst',
                color: color,
                data: [1, 2]
            }]
        }),
        series = chart.series[0],
        result;
    assert.strictEqual(
        series.color,
        color,
        'The series object has the property color with value of ' + color + '.'
    );
    result = !H.find(series.points, function (p) {
        return p.color !== color;
    });
    assert.strictEqual(
        result,
        true,
        'All points in the series has the property color with value of ' + color + '.'
    );
});