

QUnit.test('Set min/max size', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'bubble',
            animation: false,
            width: 200,
            height: 200
        },

        series: [{
            minSize: 30,
            maxSize: '1%',
            animation: false,
            data: [
                [0, 0, 0],
                [1, 0, 1],
                [2, 0, 2],
                [3, 0, 3],
                [4, 0, 4],
                [5, 0, 5]
            ]
        }]
    });

    assert.strictEqual(
        chart.series[0].points[0].marker.radius,
        15,
        'Bubble size is minSize for lowest value, despite maxSize being computed smaller'
    );
    assert.strictEqual(
        chart.series[0].points[5].marker.radius,
        15,
        'Bubble size is minSize for highest value, despite maxSize being computed smaller'
    );
});