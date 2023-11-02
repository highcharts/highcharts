QUnit.test(
    'Hover on column should call mouseOver only once (#4448).',
    function (assert) {
        let iter = 0;
        const chart = Highcharts.chart('container', {
            series: [
                {
                    type: 'column',
                    data: [107, 31, 635, 203, 2],
                    point: {
                        events: {
                            mouseOver: function () {
                                iter++;
                            }
                        }
                    }
                }
            ]
        });

        chart.hoverSeries = chart.series[0];
        chart.hoverPoint = chart.series[0].points[0];
        chart.pointer.onContainerMouseMove({
            pageX: 150,
            pageY: 310,
            target: chart.series[0].group.element
        });

        assert.strictEqual(
            iter,
            1,
            'Zero extra mouseOver calls for the first point.'
        );

        const controller = new TestController(chart);

        chart.update({
            tooltip: {
                hideDelay: 0
            }
        }, false);
        chart.series[0].update({
            enableMouseTracking: false
        });

        controller.moveTo(
            chart.plotLeft + chart.series[0].points[2].plotX,
            chart.plotTop + chart.series[0].points[2].plotY + 20,
            void 0,
            true
        );

        assert.ok(
            chart.tooltip.isHidden,
            `Tooltip should be hidden when enableMouseTracking was updated to
            false (#18985).`
        );
    }
);
