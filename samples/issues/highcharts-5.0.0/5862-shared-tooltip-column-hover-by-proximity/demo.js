$(function () {

    QUnit.test('Shared tooltip should always highlight all markers.', function (assert) {
        var hoverColor = 'red',
            chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'container'
                },
                tooltip: {
                    shared: true
                },
                series: [{
                    type: 'column',
                    data: [1, 2, 3, 4, 5],
                    states: {
                        hover: {
                            color: hoverColor
                        }
                    }
                }]
            }),
            offset = $('#container').offset(),
            left = offset.left + chart.plotLeft,
            top = offset.top + chart.plotTop,
            points = chart.series[0].points;

        chart.pointer.onContainerMouseMove({
            type: 'mousemove',
            pageX: left + points[0].plotX,
            pageY: top
        });
        chart.pointer.onContainerMouseMove({
            type: 'mousemove',
            pageX: left + points[1].plotX,
            pageY: top
        });
        chart.pointer.onContainerMouseMove({
            type: 'mousemove',
            pageX: left + points[0].plotX,
            pageY: top
        });

        assert.strictEqual(
            points[0].graphic.attr('fill'),
            hoverColor,
            'First point hovered'
        );
    });
});
