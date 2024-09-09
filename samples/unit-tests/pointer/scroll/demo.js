QUnit.test(
    'Wheel scroll with middle click should hide tooltip (#11635)',
    function (assert) {
        const container1 = document.getElementById('container'),
            container2 = document.createElement('div');

        container1.style.display = container2.style.display = 'block';
        container1.style.position = container2.style.position = 'relative';
        container2.setAttribute('id', 'container2');

        if (container1.nextSibling) {
            container1.parentNode.insertBefore(
                container2,
                container1.nextSibling
            );
        } else {
            container1.parentNode.appendChild(container2);
        }

        const chartOptions = {
                chart: {
                    width: 400,
                    height: 400
                },
                tooltip: {
                    animation: false,
                    enabled: true,
                    hideDelay: 0
                },
                series: [
                    {
                        type: 'line',
                        data: [3, 2, 1]
                    }
                ]
            },
            chart1 = Highcharts.chart('container', chartOptions),
            chart2 = Highcharts.chart('container2', chartOptions);

        try {
            const controller1 = new TestController(chart1),
                controller2 = new TestController(chart2),
                point1 = chart1.series[0].points[0],
                point2 = chart2.series[0].points[0],
                point1Position = {
                    x: point1.plotX + chart1.plotLeft + 1,
                    y: point1.plotY + chart1.plotTop + 1
                },
                point2Position = {
                    x: point2.plotX + chart2.plotLeft + 1,
                    y: point2.plotY + chart2.plotTop + 1
                };

            assert.strictEqual(
                chart1.tooltip.isHidden,
                true,
                'Tooltip of first chart should be hidden.'
            );

            assert.strictEqual(
                chart2.tooltip.isHidden,
                true,
                'Tooltip of second chart should be hidden.'
            );

            controller1.moveTo(
                point1Position.x,
                point1Position.y
            );

            assert.strictEqual(
                !chart1.tooltip.isHidden,
                true,
                'Tooltip of first chart should not be hidden.'
            );

            assert.strictEqual(
                chart2.tooltip.isHidden,
                true,
                'Tooltip of second chart should be hidden. (2)'
            );

            // simulate wheel scroll effect with middle click in
            // Chrome-based browsers
            controller1.moveTo(
                point1Position.x,
                chart1.plotHeight + point2Position.y, void 0, true
            );
            controller2.moveTo(
                point2Position.x,
                point2Position.y
            );

            // Workaround for failing test on Linux.
            // Try removing in Chrome v129+.
            if (!controller2.relatedTarget) {
                point2Position.x += 5;
                point2Position.y += 81;

                controller2.moveTo(
                    point2Position.x,
                    point2Position.y,
                    void 0,
                    true
                );
                assert.strictEqual(
                    controller2.relatedTarget,
                    true,
                    'Log: c2.relatedTarget - should highcharts-point-hover.'
                );
            }

            controller2.mouseDown(
                point2Position.x,
                point2Position.y,
                {
                    button: TestController.MouseButtons.middle,
                    target: controller2.relatedTarget
                }, true
            );

            controller2.mouseUp(
                point2Position.x,
                point2Position.y,
                {
                    button: TestController.MouseButtons.middle,
                    target: controller2.relatedTarget
                }, true
            );

            assert.strictEqual(
                chart1.tooltip.isHidden,
                true,
                'Tooltip of first chart should be hidden. (2)'
            );

            assert.strictEqual(
                !chart2.tooltip.isHidden,
                true,
                'Tooltip of second chart should not be hidden.'
            );

            const charts = chart1.container.innerHTML +
                ' ' + chart2.container.innerHTML;
            assert.strictEqual(
                charts,
                true,
                'Log: preview.'
            );
        } finally {
            chart2.destroy();
            document.body.removeChild(container2);
        }
    }
);
