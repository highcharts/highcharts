// Issue #9286
// Test for tooltip.showDelay
QUnit.test('Tooltip showDelay (#9286)', function (assert) {
    const done = assert.async();

    Highcharts.chart(
        'container',
        {
            series: [
                {
                    type: 'line',
                    data: [1, 3, 2]
                }
            ],
            tooltip: {
                animation: false,
                hideDelay: 0
            }
        },
        function (chart) {
            const controller = new TestController(chart);
            const point = chart.series[0].points[0];
            const pointPosition = {
                x: Math.round(chart.plotLeft + point.plotX),
                y: Math.round(chart.plotTop + point.plotY)
            };
            const tooltip = chart.tooltip;

            assert.strictEqual(
                tooltip.isHidden,
                true,
                'Tooltip should be hidden initially.'
            );

            controller.moveTo(pointPosition.x, pointPosition.y);

            assert.strictEqual(
                !tooltip.isHidden,
                true,
                'Default: Tooltip should be visible immediately on hover.'
            );

            controller.moveTo(chart.plotLeft, chart.plotTop);

            chart.update({
                tooltip: {
                    showDelay: 300
                }
            });

            controller.moveTo(pointPosition.x, pointPosition.y);

            assert.strictEqual(
                tooltip.isHidden,
                true,
                `With showDelay: 300, tooltip should be hidden
                    immediately on hover.`
            );

            setTimeout(function () {
                assert.strictEqual(
                    !tooltip.isHidden,
                    true,
                    `With showDelay: 300, tooltip should be visible
                        after 350ms.`
                );

                done();
            }, 350);
        }
    );
});