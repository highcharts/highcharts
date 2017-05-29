
QUnit.test('#6437 - drilldown after resize din\'t render points', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 40,
                beta: 0,
                depth: 40
            }
        },
        series: [{
            data: [10, 20]
        }]
    });

    chart.setSize(200, 200);

    assert.strictEqual(
        chart.series[0].points[0].shapeArgs.start !== undefined,
        true,
        'ShapeArgs are not modified'
    );
});
