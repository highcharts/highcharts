jQuery(function () {
    QUnit.test('Render scatter points.', function (assert) {
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
});