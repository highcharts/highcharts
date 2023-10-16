QUnit.test('Tunnel annotation on logarithmic axis, #16769', function (assert) {
    const chart = Highcharts.chart('container', {
        yAxis: {
            type: 'logarithmic'
        },
        annotations: [{
            type: 'tunnel',
            typeOptions: {
                points: [{
                    x: 2,
                    y: 4
                }, {
                    x: 4,
                    y: 6
                }]
            }
        }],

        series: [{
            data: [1, 2, 3, 2, 3, 4]
        }]
    });

    const points = chart.annotations[0].points;

    assert.close(
        points[0].plotY - points[1].plotY,
        points[3].plotY - points[2].plotY,
        0.001,
        `Height of the tunnel annotation should be the same on its left and
        right side.`
    );
});