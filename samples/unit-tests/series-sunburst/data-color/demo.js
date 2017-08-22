QUnit.test('series.data.color: default to series.color', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [{
                type: 'sunburst',
                data: [1, 2]
            }]
        }),
        series = chart.series[0],
        point = series.points[0];
    assert.strictEqual(
        point.color,
        series.color,
        'point.color equals series.color.'
    );
});

QUnit.test('series.data.color: custom color', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [{
                type: 'sunburst',
                data: [{
                    color: '#ff0000',
                    value: 1
                }, {
                    color: '#00ff00',
                    value: 1
                }]
            }]
        }),
        series = chart.series[0],
        points = series.points;
    assert.strictEqual(
        points[0].color,
        '#ff0000',
        'points[0].color equals #ff0000.'
    );
    assert.strictEqual(
        points[1].color,
        '#00ff00',
        'points[1].color equals #00ff00.'
    );
});
