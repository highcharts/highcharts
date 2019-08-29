QUnit.test('Render scatter points (#4507)', function (assert) {
    var UNDEFINED;
    $('#container').highcharts({
        chart: {
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 90,
                depth: 250,
                viewDistance: 5,
                frame: {
                    bottom: {
                        size: 1,
                        color: 'rgba(0,0,0,0.02)'
                    },
                    back: {
                        size: 1,
                        color: 'rgba(0,0,0,0.04)'
                    },
                    side: {
                        size: 1,
                        color: 'rgba(0,0,0,0.06)'
                    }
                }
            }
        },
        series: [{
            type: 'scatter',
            data: [{
                y: 100000
            }, {
                y: 20000
            }, {
                y: 100100
            }, {
                y: 100000
            }, {
                y: 110000
            }]
        }]
    });

    assert.strictEqual(
        $('#container').highcharts().series[0].points[2].graphic !== UNDEFINED,
        true,
        'Valid placement'
    );
});

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
        labelDim = axis.ticks[1].label.getBBox(),
        labelPos = Highcharts.offset(axis.ticks[1].label.element),
        point = axis.series[0].points[1],
        pointDim = point.graphic.getBBox(),
        pointPos = Highcharts.offset(point.graphic.element),
        pointX = (pointPos.left + pointDim.width / 2),
        expectedPointX = (labelPos.left + labelDim.width / 2);

    assert.close(
        pointX,
        expectedPointX,
        1.5,
        'First point is correctly aligned'
    );
});
