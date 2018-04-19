
QUnit.test('Point is on appropriate position', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            options3d: {
                enabled: true,
                alpha: 10
            }
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

    chart.xAxis[0].setExtremes(1, 2, true, false);

    var axis = chart.xAxis[0],
        labelPos = axis.ticks[1].label.element.getBoundingClientRect(),
        point = axis.series[0].points[1],
        pointPos = point.graphic.element.getBoundingClientRect(),
        pointX = Math.round(pointPos.x + pointPos.width / 2),
        expectedPointX = Math.round(labelPos.x + labelPos.width / 2, 10);

    assert.strictEqual(
        pointX,
        expectedPointX,
        'First point is correctly aligned'
    );
});
