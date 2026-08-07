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
                    ['0', '\u25CF Series 1: 1', ''],
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
                        ['0', '\u25CF Series 1: 1', ''],
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
                    ['0', '\u25CF Series 2: 1.1', ''],
                    'Tooltip should have label text of second series.'
                );
            }
        );
    });
});

// Issue #24255
// The tracker should bridge the gap between the point and the tooltip, but
// not block the surrounding plot area.
QUnit.test('Stick on contact tracker shape (#24255)', function (assert) {
    const chart = Highcharts.chart('container', {
            chart: {
                type: 'scatter',
                width: 600,
                height: 400
            },
            tooltip: {
                animation: false,
                hideDelay: 0,
                stickOnContact: true
            },
            xAxis: {
                min: 0,
                max: 10
            },
            yAxis: {
                min: 0,
                max: 10
            },
            series: [{
                data: [[4.6, 5], [5, 5]]
            }, {
                data: [[5, 8]]
            }]
        }),
        controller = new TestController(chart),
        [neighbour, point] = chart.series[0].points,
        chartX = p => chart.plotLeft + p.plotX,
        chartY = p => chart.plotTop + p.plotY,
        // Probe the area right next to the point, 4px towards the tooltip and
        // 4px off the centre line. A callout arrow reaching only its own
        // length leaves this area uncovered.
        keepsContact = p => {
            const box = chart.tooltip.label.getBBox(),
                x = chartX(p),
                y = chartY(p),
                // Vector from the point towards the tooltip
                dx = box.x + box.width / 2 - x,
                dy = box.y + box.height / 2 - y,
                len = Math.sqrt(dx * dx + dy * dy) || 1;

            return chart.pointer.inClass(
                controller.elementFromPoint(
                    x + 4 * (dx - dy) / len,
                    y + 4 * (dy + dx) / len
                ),
                'highcharts-tooltip'
            );
        };

    controller.moveTo(chartX(point), chartY(point));

    assert.strictEqual(
        chart.hoverPoint,
        point,
        'Point should be hovered.'
    );

    assert.ok(
        keepsContact(point),
        'Tracker should bridge the gap between the point and the tooltip.'
    );

    controller.moveTo(chartX(neighbour), chartY(neighbour));

    assert.strictEqual(
        chart.hoverPoint,
        neighbour,
        'Densely placed neighbour should not be blocked by the tracker.'
    );

    // Shared tooltips have no anchor on the label, so the connector is
    // derived from the last position update instead. Scatter series do not
    // take part in shared tooltips, hence the type change.
    chart.update({
        chart: {
            type: 'line'
        },
        tooltip: {
            shared: true
        }
    });

    const sharedPoint = chart.series[0].points[1];

    controller.moveTo(chart.plotLeft, chart.plotTop);
    controller.moveTo(chartX(sharedPoint), chartY(sharedPoint));

    assert.ok(
        chart.tooltip.len > 1,
        'Precondition: the tooltip should be shared between the series.'
    );

    assert.ok(
        keepsContact(sharedPoint),
        'Shared tooltip tracker should bridge the gap as well.'
    );
});

// Issue #12885
// Tooltip stickOnContact and followPointer
QUnit.test(
    'Do not stick on hover tooltip following pointer (#12885)',
    function (assert) {
        const clock = TestUtilities.lolexInstall();

        const chart = Highcharts.chart('container', {
            chart: {
                width: 600
            },
            series: [
                {
                    type: 'pie',
                    data: [4, 2, 1]
                }
            ],
            tooltip: {
                animation: false,
                followPointer: true,
                hideDelay: 0,
                stickOnContact: true
            }
        });
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

        assert.close(
            tooltipPosition2.x,
            // Util reports +1, while Playwright, after merging master into the
            // v13 branch, reports +2. Not able to find out why.
            tooltipPosition1.x + 1.5,
            0.5,
            'Tooltip should move horizontally with pointer movement'
        );

        assert.strictEqual(
            tooltipPosition2.y,
            tooltipPosition1.y + 1,
            'Tooltip should move vertically with pointer movement'
        );

        chart.update({
            tooltip: {
                followPointer: false
            }
        }, false);

        chart.series[0].update({
            type: 'column',
            tooltip: {
                followPointer: true
            }
        }, false);

        chart.addSeries({
            type: 'scatter',
            data: [0]
        });

        const columnBox = chart.series[0].points[0].graphic.getBBox(),
            pointBox2 = chart.series[1].points[0].graphic.getBBox();

        controller.moveTo(
            columnBox.x + chart.plotLeft + (columnBox.width / 2),
            columnBox.y + chart.plotTop + (columnBox.height / 2)
        );

        controller.moveTo(
            pointBox2.x + chart.plotLeft + (pointBox2.width / 2),
            pointBox2.y + chart.plotTop + (pointBox2.height / 2)
        );

        controller.moveTo(
            columnBox.x + chart.plotLeft + (columnBox.width / 2),
            columnBox.y + chart.plotTop + (columnBox.height / 2)
        );
        assert.notEqual(
            tooltip.label.visibility,
            'hidden',
            `There should be no errors in the console and tooltip should
            be visible, when moving mouse between one series with
            followPointer set to true and second series set to false
            (#18693).`
        );

        // #23303
        chart.update({
            series: [{
                type: 'column',
                data: [1],
                tooltip: {
                    followPointer: false
                }
            }],
            tooltip: {
                stickOnContact: true,
                useHTML: true,
                hideDelay: 500
            }
        }, true, true);

        const column = chart.series[0].points[0].shapeArgs,
            columnX = chart.plotLeft + column.x + column.width / 2,
            columnY = chart.plotTop + column.y + column.height / 2;

        controller.moveTo(columnX, columnY);

        setTimeout(() => {
            assert.ok(!tooltip.isHidden, `Tooltip visible after
            hovering point.`);

            const tooltipBBox = tooltip.label.element.getBBox(),
                tooltipX = tooltip.label.x + tooltipBBox.width / 2,
                tooltipY = tooltip.label.y + tooltipBBox.height / 2;

            controller.moveTo(columnX + 10, columnY);
            controller.moveTo(tooltipX, tooltipY);

            setTimeout(() => {
                assert.ok(
                    !tooltip.isHidden,
                    `Tooltip should remain visible when leaving point
                    and entering tooltip.`
                );
            }, 300);
        }, 100);

        TestUtilities.lolexUninstall(clock);
    }
);