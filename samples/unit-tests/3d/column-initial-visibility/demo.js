QUnit.test('3D columns with initial visibility', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'column',
            animation: false,
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 0,
                depth: 300,
                viewDistance: 5
            }
        },
        series: [{
            visible: false,
            data: [{
                x: 1,
                y: 4
            }, {
                x: 2,
                y: 9
            }, {
                x: 3,
                y: 9
            }]
        }, {
            data: [{
                x: 1,
                y: 5
            }, {
                x: 2,
                y: 10
            }, {
                x: 3,
                y: 10
            }]
        }]
    });

    assert.strictEqual(
        chart.series[1].data[0].series.group.visibility,
        'visible',
        'Second series is visible'
    );

});