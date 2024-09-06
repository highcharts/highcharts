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
                    height: 400,
                    events: {
                        load: function () {
                            const renderer = this.renderer;
                            let col = 0;
            
                            // grid rows to avoid crash
                            for (let row = 0; row < 400; row++) {
                                // Col is fine...
                                //for (let col = 0; col < 600; col++) {
                                    renderer.rect(col, row, 600, 1)
                                        .attr({
                                            class: `grid-point col-${col} row-${row}`,
                                            zIndex: 99,
                                            fill: '#' +
                                                (col % 16).toString(16) +
                                                (row % 16).toString(16) +
                                                ((row + col) % 16).toString(16)
                                        })
                                        .add();
                                //}
                            }
                        }
                    }
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

            // Workaround for failing test on Linux.
            // Try removing in Chrome v129+.

            assert.strictEqual(
                controller1.elementsFromPoint(
                    point1Position.x,
                    point1Position.y
                ).slice(0, 3),
                point1Position.y,
                'Logging: controller1 offset.'
            );

            assert.strictEqual(
                controller2.elementsFromPoint(
                    point2Position.x,
                    point2Position.y
                ).slice(0, 3),
                point2Position.y,
                'Logging: controller2 offset.'
            );

            

            assert.strictEqual(
                Highcharts.offset(chart2.container),
                'maybe 8s ? maybe else...',
                'Logging: chart2 offset.'
            );

            const correction1 = (
                    controller1.elementsFromPoint(
                        point1Position.x,
                        point1Position.y
                    ).indexOf(point1.graphic.element) < 0
                ) ? -8 : 0,
                correction2 = (
                    controller2.elementsFromPoint(
                        point2Position.x,
                        point2Position.y
                    ).indexOf(point2.graphic.element) < 0
                ) ? -400 : 0;

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
                point1Position.y + correction1
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
                chart1.plotHeight + point2Position.y + correction1
            );
            controller2.moveTo(
                point2Position.x,
                point2Position.y + correction2
            );
            controller2.mouseDown(
                point2Position.x,
                point2Position.y + correction2,
                {
                    button: TestController.MouseButtons.middle,
                    target: controller2.relatedTarget
                }
            );
            controller2.mouseUp(
                point2Position.x,
                point2Position.y + correction2,
                {
                    button: TestController.MouseButtons.middle,
                    target: controller2.relatedTarget
                }
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
        } finally {
            chart2.destroy();
            document.body.removeChild(container2);
        }
    }
);
