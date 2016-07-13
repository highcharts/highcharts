$(function () {
    QUnit.test('Crosshair.snap = false visibility after adding a point', function (assert) {
        var chart = Highcharts.StockChart({
            chart: {
                renderTo: 'container',
                events: {
                    load: function() {
                        var chart = this,
                            point = chart.series[0].points[2],
                            offset = $(chart.container).offset();

                        chart.pointer.onContainerMouseMove({
                            type: 'mousemove',
                            pageX: point.plotX + chart.plotLeft + offset.left,
                            pageY: point.plotY + chart.plotTop + offset.top,
                            target: chart.container
                        });
                        chart.series[0].addPoint(Math.random() * 100, true, true);
                    }
                }
            },
            series: [{
                data: [10, 20, 30, 10, 10, 10]
            }],
            xAxis: {
                crosshair: {
                    snap: true
                }
            },
            yAxis: {
                crosshair: {
                    snap: false
                }
            }
          });

        assert.strictEqual(
            chart.yAxis[0].cross.attr('visibility'),
            'visible',
            'Crosshair is visible'
        );
    });
});