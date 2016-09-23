$(function () {
    QUnit.test('Click event was called for a wrong series', function (assert) {

        var $container = $('#container'),
            chart = $container.highcharts({
                yAxis: [{
                    opposite: true
                }, {
                    opposite: true
                }, {
                    opposite: true
                }],
                tooltip: {
                    shared: true
                },
                series: [{
                    type: 'column',
                    yAxis: 1,
                    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
                    zIndex: 1
                }, {
                    yAxis: 2,
                    data: [1016, 1016, 1015.9, 1015.5, 1012.3, 1009.5, 1009.6, 1010.2, 1013.1, 1016.9, 1018.2, 1016.7],
                    zIndex: 2
                }, {
                    type: 'spline',
                    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
                    zIndex: 1000,
                    lineWidth: 10
                }]
            }).highcharts(),
            offset = $container.offset(),
            left = offset.left + chart.plotLeft,
            top = offset.top + chart.plotTop,
            point = chart.series[2].points[2];

        chart.pointer.onContainerMouseMove({
            type: 'mousemove',
            pageX: left + point.plotX,
            pageY: top + point.plotY,
            target: point.series.group.element
        });

        assert.strictEqual(
            chart.hoverPoint && chart.hoverPoint.series.type,
            chart.series[2].type,
            'Correct point hovered.'
        );
    });
});
