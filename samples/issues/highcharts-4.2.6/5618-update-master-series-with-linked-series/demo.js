$(function () {
    QUnit.test('Updating master series, cause linked series to hide, with visible graph.', function (assert) {

        var chart = $('#container').highcharts({
                series: []
            }).highcharts(),
            offset;


        chart.addSeries({
            visible: false,
            id: 'main',
            data: [1, 101]
        }, false);

        chart.addSeries({
            visible: false,
            linkedTo: 'main',
            data: [100, 10]
        });

        chart.series[0].show();

        chart.series[0].update({
            dataLabels: {
                enabled: true
            }
        });

        offset = $(chart.container).offset();

        chart.pointer.onContainerMouseMove({
            type: 'mousemove',
            pageX: offset.left + 110,
            pageY: offset.top + 100,
            target: chart.container
        });

        assert.strictEqual(
            chart.hoverPoint.y,
            chart.series[1].points[0].y,
            'Correct point hovered'
        );
    });
});
