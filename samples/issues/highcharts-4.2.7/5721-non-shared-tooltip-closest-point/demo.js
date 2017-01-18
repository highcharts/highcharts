$(function () {
    QUnit.test('Non-shared tooltip should highlight the clostest point.', function (assert) {

        var $container = $('#container'),
            chart = $container.highcharts({
                series: [{
                    data: [
                        [0, 2],
                        [0.51, 2]
                    ]
                }, {
                    data: [
                        [0.5, 1],
                        [1, 1]
                    ]
                }]
            }).highcharts(),
            offset = $container.offset(),
            left = offset.left + chart.plotLeft,
            top = offset.top + chart.plotTop,
            point = chart.series[0].points[1];

        chart.pointer.onContainerMouseMove({
            type: 'mousemove',
            pageX: left + point.plotX - 5,
            pageY: top + point.plotY - 5,
            target: point.series.group.element
        });

        assert.strictEqual(
            chart.hoverPoint && chart.hoverPoint.x,
            point.x,
            'Correct point hovered.'
        );
    });
});
