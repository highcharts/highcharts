QUnit.test(
    'Stack ID and crosshairs',
    function (assert) {
        const chart = Highcharts.chart('container', {
            chart: {
                type: 'column',
                options3d: {
                    enabled: true,
                    alpha: 6,
                    beta: 15,
                    viewDistance: 0,
                    depth: 40
                }
            },
            series: [
                {
                    data: [5, 10],
                    stack: 'm1'
                },
                {
                    data: [2, 4],
                    stack: 'm1'
                }
            ],
            yAxis: {
                crosshair: true
            }
        });

        assert.strictEqual(
            chart.series[0].points.length,
            2,
            'No error should happen when stack ID\'s are strings in 3D.(#4532)'
        );

        chart.series[0].points[0].onMouseOver();

        assert.strictEqual(
            chart.yAxis[0].cross.pathArray.length,
            4,
            'yAxis crosshair should work for 3d column series.'
        );
    }
);
