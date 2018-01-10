QUnit.test('series.data.id: default to undefined', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [{
                type: 'sunburst',
                data: [1, 2]
            }]
        }),
        series = chart.series[0],
        result;
    result = !H.find(series.points, function (p) {
        return p.id !== undefined;
    });
    assert.strictEqual(
        result,
        true,
        'All points has a property id with value undefined'
    );
});

QUnit.test('series.data.id: custom id', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [{
                type: 'sunburst',
                data: [{
                    value: 1,
                    id: '1'
                }, {
                    value: 2,
                    id: '2'
                }]
            }]
        }),
        series = chart.series[0];
    assert.strictEqual(
        series.points[0].id,
        '1',
        'series.points[0] has a property id with value of "1"'
    );
    assert.strictEqual(
        series.points[1].id,
        '2',
        'series.points[1] has a property id with value of "2"'
    );
});
