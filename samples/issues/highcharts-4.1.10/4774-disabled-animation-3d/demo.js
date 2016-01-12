 $(function () {
    QUnit.test('3D column chart with disabled animation should properly set zIndexes for cuboids.', function (assert) {
        var chart = new Highcharts.Chart({
            chart: {
                animation: false,
                renderTo: 'container',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 45
                }
            },
            series: [{
                animation: false,
                data: [10, 20, 30, 40, 50, 10, 20, 10, 20, 30, 40, 50, 10, 20, 10, 20, 30, 40, 50, 10, 20, 10, 20, 30, 40, 50, 10, 20, 10, 20, 30, 40, 50, 10, 20],
                type: "column",
                depth: 100
            }]
        });


        assert.ok(
            chart.series[0].points[4].graphic.attr('zIndex') < chart.series[0].points[5].graphic.attr('zIndex'),
            'Proper zIndex'
        );
    });
});