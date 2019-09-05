QUnit.test("Empty first series in map should render without problems (#5295)", function (assert) {
    var chart = Highcharts.mapChart("container", {
        colorAxis: {
            min: 0,
            minColor: "#EFEFFF",
            maxColor: "#102D4C"
        },
        series: [{}, {
            data: [{
                "hc-key": "au-nt",
                value: 0
            }],
            mapData: Highcharts.maps['countries/au/au-all'],
            joinBy: 'hc-key'
        }]
    });

    assert.strictEqual(chart.series[1].points[0].color, 'rgb(128,142,166)', 'Color has been set correctly');
});

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

    chart.series[0].update({
        borderWidth: 0
    });

    assert.strictEqual(
        chart.series[0].group.element.getAttribute('stroke-width'),
        '0',
        'The stroke width should be 0'
    );
});
