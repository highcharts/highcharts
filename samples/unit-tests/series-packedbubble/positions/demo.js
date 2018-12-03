QUnit.test('Bubble positions', function (assert) {
    var data,
        round = Math.round,
        chart = Highcharts.chart('container', {
            chart: {
                type: 'packedbubble',
                width: 500,
                height: 500
            },
            series: [{
                data: [50, 80, 50]
            }]
        });

    data = chart.series[0].data;
    assert.deepEqual(
        chart.series[0].placeBubbles([
            [null, null, 35, 0, 0],
            [null, null, 50, 0, 1],
            [null, null, 35, 0, 2]
        ]).map(function (p) {
            return [round(p[0]), round(p[1]), round(p[2]), round(p[3]), round(p[4])];
        }),
        [[0, 0, 104, 0, 1], [0, -177, 73, 0, 0], [133, -117, 73, 0, 2]],
        'Positions are correct'
    );

    assert.strictEqual(
        ((data[0].marker.radius >= 76) && (data[0].marker.radius <= 78)) &&
        ((data[1].marker.radius >= 98) && (data[1].marker.radius <= 100)) &&
        ((data[2].marker.radius >= 76) && (data[2].marker.radius <= 78)),
        true,
        'Radius are correct'
    );
});