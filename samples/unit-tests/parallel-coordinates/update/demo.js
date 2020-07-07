// Update unassigned points from y-axes (#13608)
QUnit.test('#13608', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            parallelCoordinates: true
        },
        series: [{
            data: [1, 2, 3]
        }]
    });

    var oldMax = chart.yAxis.map(function (yAxis) {
        return yAxis.max;
    });

    chart.update({
        chart: {
            parallelCoordinates: true
        }
    });

    var newMax = chart.yAxis.map(function (yAxis) {
        return yAxis.max;
    });

    assert.deepEqual(
        newMax,
        oldMax,
        'Points should be kept on axes.'
    );

});
