QUnit.test('3D columns dataLabels initial visibility', function (assert) {
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
            dataLabels: {
                enabled: true
            },
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
        chart.series[0].dataLabelsGroup.element.children.length > 0,
        true,
        'Series dataLabels are visible'
    );
});