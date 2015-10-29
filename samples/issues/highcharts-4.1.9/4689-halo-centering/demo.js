
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

        function getCenter(box, plotBox) {
            return [
                (box.x + box.width / 2 + (plotBox ? plotBox.x : 0)).toFixed(2),
                (box.y + box.height / 2 + (plotBox ? plotBox.y : 0)).toFixed(2)
            ].join(',');
        }

        // Non-inverted chart
        chart = $('#container').highcharts(options).highcharts();

        for (var i = 0; i < chart.series[0].points.length; i++) {
            chart.series[0].points[i].onMouseOver();
            assert.strictEqual(
                getCenter(chart.series[0].points[i].graphic.getBBox(), chart.plotBox),
                getCenter(chart.series[0].halo.getBBox()),
                'Point ' + i + ' and halo has the same center'
            );
        }
    });
});