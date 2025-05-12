QUnit.test('zIndex for 3d scatter', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'scatter',
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 50,
                depth: 500,
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
        zAxis: {
            min: 0,
            max: 10,
            inverted: true
        },
        series: [
            {
                marker: {
                    radius: 20
                },
                data: [{
                    x: 3,
                    y: 4.4,
                    z: 8,
                    color: 'green'
                }, {
                    x: 7.9,
                    y: 7.1,
                    z: 2,
                    color: 'yellow'
                }]
            }
        ]
    });
    const data = chart.series[0].data;

    assert.strictEqual(
        data[0].graphic.zIndex < data[1].graphic.zIndex,
        true,
        'zIndex is correct for scatter series (#3949)'
    );
});

QUnit.test('Undefined and null z scatter points ', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 90,
                depth: 250,
                viewDistance: 5
            }
        },
        series: [
            {
                type: 'scatter',
                data: [{
                    y: 100000,
                    z: null
                }, {
                    y: 20000
                }, {
                    y: 100100
                }, {
                    y: 100000
                }, {
                    y: 110000
                }]
            }
        ]
    });

    assert.ok(
        chart.series[0].points.every(p => p.graphic),
        'All points should have rendered, indluding null z (#4507, #12548).'
    );
});

QUnit.test('Point is on appropriate position', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            options3d: {
                enabled: true,
                alpha: 5
            }
        },
        xAxis: {
            categories: [
                'Jan',
                'Feb',
                'Mar'
            ],
            minRange: 1
        },
        series: [{
            type: 'scatter',
            data: [[0, 10], [1, 20], [2, 5], [3, 3]]
        }]
    });
    chart.xAxis[0].setExtremes(1, 2);

    const axis = chart.xAxis[0],
        labelDim = axis.ticks[1].label.getBBox(),
        labelPos = Highcharts.offset(axis.ticks[1].label.element),
        point = axis.series[0].points[1],
        pointDim = point.graphic.getBBox(),
        pointPos = Highcharts.offset(point.graphic.element),
        pointX = pointPos.left + pointDim.width / 2,
        expectedPointX = labelPos.left + labelDim.width / 2;

    assert.close(
        pointX,
        expectedPointX,
        5,
        'First point is over its category axis label after the zoom.'
    );
});
