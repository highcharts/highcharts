QUnit.test('Update from 2D to 3D stacked columns', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'column'
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: [{
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
    }, function (chart) {
        chart.update({
            chart: {
                options3d: {
                    enabled: true,
                    beta: 20,
                    alpha: 30
                }
            }
        });
    });
    assert.strictEqual(
        chart.series[1].group.element.children.length,
        6,
        'Both series are in the same group'
    );

});