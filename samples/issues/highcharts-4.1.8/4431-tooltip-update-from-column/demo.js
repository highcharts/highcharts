$(function () {
    QUnit.test('Tooltip does not work after updating from column series.', function (assert) {
        var chart = $('#container').highcharts({
            series: [{
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5],
                type: 'column'
            }]
        }).highcharts();

        chart.series[0].update({
            type: "scatter"
        }, true, false);
        chart.series[0].update({
            type: "line"
        }, true, false);

        var point = chart.series[0].points[2],
            offset = $(chart.container).offset();

        // Set hoverPoint
        point.onMouseOver();

        chart.pointer.onContainerMouseMove({
            type: 'mousemove',
            pageX: point.plotX + chart.plotLeft + offset.left,
            pageY: point.plotY + chart.plotTop + offset.top,
            target: chart.container
        });

        assert.strictEqual(
            chart.tooltip.isHidden,
            false,
            'Tooltip displayed properly'
        );
    });
});