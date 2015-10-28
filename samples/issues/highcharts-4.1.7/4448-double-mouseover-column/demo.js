$(function () {
    QUnit.test("Hover on column should call mouseOver only once." , function (assert) {

        var iter = 0,
            chart = $('#container').highcharts({
                series: [{
                    type: 'column',
                    data: [107, 31, 635, 203, 2],
                    point: {
                        events: {
                            mouseOver: function () {
                                iter++;
                            }
                        }
                    }
                }]
            }).highcharts();

        chart.hoverSeries = chart.series[0];
        chart.hoverPoint = chart.series[0].points[0];
        chart.pointer.onContainerMouseMove({
            pageX: 150,
            pageY: 310,
            target: chart.series[0].group.element
        });

        assert.strictEqual(
            iter,
            0,
            "Zero extra mouseOver calls for the first point."
        );

    });
});