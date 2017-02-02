
QUnit.test('Null points', function (assert) {
    var chart = Highcharts.mapChart('container', {
        series: [{
            mapData: Highcharts.maps['custom/europe'],
            data: [
                ['no', 5],
                ['fr', 3],
                ['gb', 2],
                ['it', null]
            ]
        }]
    });

    assert.notOk(
        chart.series[0].points[0].isNull,
        'Point with data is not a null point'
    );

    assert.notOk(
        chart.series[0].points[0].graphic.hasClass('highcharts-null-point'),
        "Point with data doesn't have null point class"
    );

    assert.ok(
        chart.series[0].points[3].isNull,
        'Point with null value is a null point'
    );

    assert.ok(
        chart.series[0].points[3].graphic.hasClass('highcharts-null-point'),
        'Point with null value has null point class'
    );

    assert.ok(
        chart.series[0].points[4].isNull,
        'Point with no data is a null point'
    );

    assert.ok(
        chart.series[0].points[4].graphic.hasClass('highcharts-null-point'),
        'Point with no data has null point class'
    );
});
