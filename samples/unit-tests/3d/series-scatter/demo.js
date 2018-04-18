
QUnit.test('Point is on appropriate position', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 10
            },
            zoomType: 'x'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            minRange: 1
        },

        series: [{
            type: 'scatter',
            data: [{
                x: 0,
                y: 10
            }, {
                x: 1,
                y: 20
            }, {
                x: 2,
                y: 5
            }, {
                x: 3,
                y: 3
            }]
        }]
    });

    var axis = chart.xAxis[0],
        point = axis.series[0].points[0],
        pointX = point.clientX,
        expectedPointX = axis.toPixels(point.x, true);

    console.log(expectedPointX, pointX);

    assert.strictEqual(
        pointX,
        expectedPointX,
        'First point is correctly aligned'
    );

});
