QUnit.test('series.cursor: default to undefined', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [{
                type: 'sunburst',
                data: [1, 2]
            }]
        }),
        series = chart.series[0],
        result;
    assert.strictEqual(
        series.options.cursor,
        undefined,
        'series.cursor is undefined'
    );
    result = !H.find(series.points, function (p) {
        return H.getStyle(p.graphic.element, 'cursor', false) !== 'auto';
    });
    assert.strictEqual(
        result,
        true,
        'All points has a cursor value of "auto"'
    );
});

QUnit.test('series.cursor: "pointer"', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [{
                type: 'sunburst',
                data: [1, 2],
                cursor: 'pointer'
            }]
        }),
        series = chart.series[0],
        result;
    assert.strictEqual(
        series.options.cursor,
        'pointer',
        'series has a property cursor with a value "pointer"'
    );
    result = !H.find(series.points, function (p) {
        return H.getStyle(p.graphic.element, 'cursor', false) !== 'pointer';
    });
    assert.strictEqual(
        result,
        true,
        'All points has a cursor value of "pointer"'
    );
});
