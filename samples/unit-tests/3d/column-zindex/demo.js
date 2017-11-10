
QUnit.test('Column zIndex calculation #5297', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'column',
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 80,
                depth: 300,
                viewDistance: 5
            }
        },
        xAxis: {
            min: 0,
            max: 10
        },
        yAxis: {
            min: 0,
            max: 10
        },
        series: [{
            data: [{
                x: 5,
                y: 5,
                color: 'yellow'
            }]
        }, {
            data: [{
                x: 3,
                y: 5,
                color: 'green'
            }]
        }]
    });
    var point1 = chart.series[0].data[0],
        point2 = chart.series[1].data[0];

    assert.strictEqual(
        (point2.graphic.zIndex < point1.graphic.zIndex),
        true,
        'zIndex is correct for column series'
    );
});
