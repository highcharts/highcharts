// Issue #13310, #12736
// Mousing over tooltip should not dismiss it, move it, or change points.
QUnit.test('Stick on hover tooltip (#13310, #12736)', function (assert) {
    [false, true].forEach(function (useHTML) {
        Highcharts.chart(
            'container',
            {
                chart: {
                    useHTML: useHTML
                },
                series: [
                    {
                        type: 'line',
                        data: [1, 3, 2]
                    },
                    {
                        type: 'line',
                        data: [1.1, 3.1, 2.1]
                    }
                ],
                tooltip: {
                    animation: false,
                    hideDelay: 0,
                    stickOnContact: true
                }
            },
            function (chart) {
                var controller = new TestController(chart),
                    series1Point = chart.series[0].points[0],
                    series1PointPosition = {
                        x: Math.round(chart.plotLeft + series1Point.plotX),
                        y: Math.round(chart.plotTop + series1Point.plotY)
                    },
                    series2Point = chart.series[1].points[0],
                    series2PointPosition = {
                        x: Math.round(chart.plotLeft + series2Point.plotX),
                        y: Math.round(chart.plotTop + series2Point.plotY)
                    },
                    tooltip = chart.tooltip;

                assert.strictEqual(
                    tooltip.isHidden,
                    true,
                    'Tooltip should be hidden.'
                );

                controller.setPosition(
                    series1PointPosition.x,
                    series1PointPosition.y
                );
                controller.moveTo(
                    series1PointPosition.x,
                    series1PointPosition.y
                );

                assert.strictEqual(
                    !tooltip.isHidden,
                    true,
                    'Tooltip should be visible.'
                );

                assert.deepEqual(
                    tooltip.label.text.element.textContent.split('\u200B'),
                    ['0', '● Series 1: 1', ''],
                    'Tooltip should have label text of first series.'
                );

                controller.moveTo(
                    series2PointPosition.x,
                    series2PointPosition.y
                );

                assert.strictEqual(
                    !tooltip.isHidden,
                    true,
                    'Tooltip should be visible.'
                );

                // We haven't found out why it fails on Firefox (#16907)
                if (navigator.userAgent.indexOf('Firefox') === -1) {
                    assert.deepEqual(
                        tooltip.label && tooltip.label.text.element.textContent
                            .split('\u200B'),
                        ['0', '● Series 1: 1', ''],
                        'Tooltip should have label text of first series. (2)'
                    );
                }

                controller.moveTo(chart.plotLeft, chart.plotTop);
                controller.moveTo(
                    series2PointPosition.x,
                    series2PointPosition.y
                );

                assert.strictEqual(
                    !tooltip.isHidden,
                    true,
                    'Tooltip should be visible.'
                );

                assert.deepEqual(
                    tooltip.label && tooltip.label.text.element.textContent
                        .split('\u200B'),
                    ['0', '● Series 2: 1.1', ''],
                    'Tooltip should have label text of second series.'
                );
            }
        );
    });
});

// Issue #12885
// Tooltip stickOnContact and followPointer
QUnit.test(
    'Do not stick on hover tooltip following pointer (#12885)',
    function (assert) {
        Highcharts.chart(
            'container',
            {
                series: [
                    {
                        type: 'pie',
                        data: [3, 2, 1]
                    }
                ],
                tooltip: {
                    animation: false,
                    followPointer: true,
                    hideDelay: 0,
                    stickOnContact: true
                }
            },
            function (chart) {
                var controller = new TestController(chart),
                    pointBox = chart.series[0].points[0].graphic.getBBox(),
                    pointerPosition = {
                        x: chart.plotLeft + pointBox.x + pointBox.width / 2,
                        y: chart.plotTop + pointBox.y + pointBox.height / 2
                    },
                    tooltip = chart.tooltip;

                controller.moveTo(pointerPosition.x, pointerPosition.y);

                var tooltipPosition1 = {
                    x: tooltip.label.x,
                    y: tooltip.label.y
                };

                controller.moveTo(pointerPosition.x + 1, pointerPosition.y + 1);

                var tooltipPosition2 = {
                    x: tooltip.label.x,
                    y: tooltip.label.y
                };

                assert.deepEqual(
                    tooltipPosition2,
                    { x: tooltipPosition1.x + 1, y: tooltipPosition1.y + 1 },
                    'Tooltip should move with pointer movement.'
                );
            }
        );
    }
);
