
$(function () {
    QUnit.test("Update crosshair's stroke-width after resize.", function (assert) {
        var chart = $("#container").highcharts({
                xAxis: {
                    type: "category"
                },
                tooltip: {
                    crosshairs: [true, false]
                },
                series: [{
                    data: [5, 10, 15]
                }]
            }).highcharts(),
            offset = $("#container").offset(),
            point = chart.series[0].points[0],
            x = offset.left + 50,
            y = offset.top + 50;

        chart.pointer.onContainerMouseMove({
            pageX: x,
            pageY: y,
            target: point.graphic.element
        });

        chart.setSize(300, 400);

        chart.pointer.onContainerMouseMove({
            pageX: x + 30,
            pageY: y,
            target: point.graphic.element
        });

        assert.equal(
            chart.xAxis[0].cross.attr("stroke-width"),
            chart.xAxis[0].transA,
            'Proper width after resize'
        );
    });
});