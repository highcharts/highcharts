$(function () {
    QUnit.test('Mouse events on dataLabels with useHTML set to true.', function (assert) {
        var clicked = false,
            chart = new Highcharts.Chart({
                chart: {
                    type: 'pie',
                    renderTo: 'container'
                },
                series: [{
                    dataLabels: {
                        useHTML: true
                    },
                    point: {
                        events: {
                            click: function () {
                                clicked = true;
                            }
                        }
                    },
                    data: [
                        ['Firefox', 44.2],
                        ['IE7', 26.6],
                        ['IE6', 20],
                        ['Chrome', 3.1],
                        ['Other', 5.4]
                    ]
                }]
            }),
            points = chart.series[0].points,
            offset = Highcharts.offset(chart.container),
            event = $.Event('mouseover', {
                which: 1,
                pageX: offset.left + points[0].labelPos[0],
                pageY: offset.top + points[0].labelPos[1]
            });

        $(points[0].dataLabel.div).trigger(event);

        assert.strictEqual(
            points[0] === chart.hoverPoint,
            true,
            'First point hovered.'
        );

        event = $.Event('mouseover', {
            which: 1,
            pageX: offset.left + points[4].labelPos[0],
            pageY: offset.top + points[4].labelPos[1]
        });

        $(points[4].dataLabel.div).trigger(event);

        assert.strictEqual(
            points[4] === chart.hoverPoint,
            true,
            'Last point hovered.'
        );

        chart.pointer.onContainerClick({
            pageX: offset.left + points[4].labelPos[0],
            pageY: offset.top + points[4].labelPos[1],
            target: points[4].dataLabel.div
        });

        assert.strictEqual(
            clicked,
            true,
            'Click event on dataLabel works.'
        );
    });
});
