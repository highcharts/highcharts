QUnit.test('Inside or outside plot area', function (assert) {
    var chart = Highcharts.chart('container', {
        xAxis: {
            min: 20,
            max: 100
        },
        series: [{
            type: 'vector',
            data: [
                [15, 95, 90, 198],
                [20, 5, 175, 45],
                [120, 10, 170, 54]
            ]
        }]

    });

    assert.strictEqual(
        chart.series[0].points.map(function (point) {
            return Boolean(point.graphic);
        }).join(','),
        'false,true,false',
        'Hidden points ouside plot area (#7381)'
    );
});