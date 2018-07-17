
$(function () {
    QUnit.test('Center the halo on the point', function (assert) {
        var chart,
            options = {
                chart: {
                    width: 500,
                    height: 300
                },
                series: [{
                    data: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512]
                }],
                plotOptions: {
                    line: {
                        marker: {
                            symbol: 'circle',
                            states: {
                                hover: {
                                    fillColor: 'white',
                                    radius: 2
                                }
                            }
                        },
                        states: {
                            hover: {
                                halo: {
                                    size: 5,
                                    opacity: 1,
                                    attributes: {
                                        fill: 'black'
                                    }
                                },
                                lineWidthPlus: 0
                            }
                        }
                    }
                }
            };

        function getCenter(box) {
            return [
                (box.x + box.width / 2).toFixed(0),
                (box.y + box.height / 2).toFixed(0)
            ].join(',');
        }

        // Non-inverted chart
        chart = $('#container').highcharts(options).highcharts();

        for (var i = 0; i < chart.series[0].points.length; i++) {
            chart.series[0].points[i].onMouseOver();
            assert.strictEqual(
                getCenter(chart.series[0].points[i].graphic.getBBox()),
                getCenter(chart.series[0].halo.getBBox()),
                'Point ' + i + ' and halo has the same center'
            );
        }
    });
});