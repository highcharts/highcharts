// Issue #12885
// Tooltip stickOnContact and followPointer
QUnit.test('Do not stick on hover tooltip following pointer (#12885)', function (assert) {
    Highcharts.chart('container', {
        series: [{
            type: 'pie',
            data: [3, 2, 1]
        }],
        tooltip: {
            stickOnContact: true
        }
    }, function (chart) {

        var controller = new TestController(chart),
            pointBox = chart.series[0].points[0].graphic.getBBox(),
            pointerPosition = {
                x: (chart.plotLeft + pointBox.x + (pointBox.width / 2)),
                y: (chart.plotTop + pointBox.y + (pointBox.height / 2))
            },
            tooltip = chart.tooltip;

        controller.moveTo(pointerPosition.x, pointerPosition.y);

        var tooltipPosition1 = { x: tooltip.label.x, y: tooltip.label.y };

        controller.moveTo(pointerPosition.x + 1, pointerPosition.y + 1);

        var tooltipPosition2 = { x: tooltip.label.x, y: tooltip.label.y };

        assert.deepEqual(
            tooltipPosition2,
            { x: tooltipPosition1.x + 1, y: tooltipPosition1.y + 1 },
            'Tooltip should move with pointer movement.'
        );
    });
});

// Issue #12736
// Mousing over tooltip should not dismiss it, move it, or change points.
QUnit.test('Stick on hover tooltip (#12736)', function (assert) {

    Highcharts.chart('container', {
        series: [{
            type: 'line',
            data: [1, 3, 2]
        }, {
            type: 'line',
            data: [1.1, 3.1, 2.1]
        }],
        tooltip: {
            stickOnContact: true
        }
    }, function (chart) {

        var controller = new TestController(chart),
            series1Point = chart.series[0].points[0],
            series1PointPosition = {
                x: (chart.plotLeft + series1Point.plotX),
                y: (chart.plotTop + series1Point.plotY)
            },
            series2Point = chart.series[1].points[0],
            series2PointPosition = {
                x: (chart.plotLeft + series2Point.plotX),
                y: (chart.plotTop + series2Point.plotY)
            },
            tooltip = chart.tooltip;

        assert.strictEqual(
            tooltip.isHidden,
            true,
            'Tooltip should be hidden.'
        );

        controller.moveTo(series1PointPosition.x, series1PointPosition.y);

        assert.strictEqual(
            tooltip.isHidden,
            false,
            'Tooltip should be visible.'
        );

        assert.strictEqual(
            tooltip.label.text.element.textContent,
            '0● Series 1: 1',
            'Tooltip should have label text of first series.'
        );

        controller.moveTo(series2PointPosition.x, series2PointPosition.y);

        assert.strictEqual(
            tooltip.isHidden,
            false,
            'Tooltip should be visible.'
        );

        assert.strictEqual(
            tooltip.label.text.element.textContent,
            '0● Series 1: 1',
            'Tooltip should have label text of first series.'
        );

        controller.moveTo(series2PointPosition.x + 10, series2PointPosition.y - 10);

        assert.strictEqual(
            tooltip.isHidden,
            false,
            'Tooltip should be visible.'
        );

        assert.strictEqual(
            tooltip.label.text.element.textContent,
            '0● Series 1: 1',
            'Tooltip should have label text of first series.'
        );

        controller.moveTo(series2PointPosition.x, chart.plotTop);
        controller.moveTo(series2PointPosition.x, series2PointPosition.y);

        assert.strictEqual(
            tooltip.isHidden,
            false,
            'Tooltip should be visible.'
        );

        assert.strictEqual(
            tooltip.label.text.element.textContent,
            '0● Series 2: 1.1',
            'Tooltip should have label text of second series.'
        );
    });
});
