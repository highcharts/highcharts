QUnit.test('zAxis update through chart.update() (#6566)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'scatter',
            options3d: {
                enabled: true
            }
        },
        zAxis: {
            min: 10,
            max: 20
        },
        series: [{
            data: [
                [5, 5, 5],
                [10, 10, 10],
                [15, 15, 15],
                [20, 20, 20],
                [25, 25, 25]
            ]
        }]
    });

    chart.update({
        zAxis: {
            min: 0,
            max: 30,
            labels: {
                enabled: false
            }
        }
    });

    assert.strictEqual(
        chart.series[0].points[0].isInside && chart.series[0].points[4].isInside,
        true,
        'zAxis updated'
    );
});
