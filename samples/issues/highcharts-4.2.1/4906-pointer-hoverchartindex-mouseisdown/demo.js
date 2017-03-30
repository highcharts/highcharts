$(function () {
    QUnit.test('Do not change hoverChartIndex during a drag.', function (assert) {
        var chart1,
            chart2,
            offset1,
            offset2,
            y,
            start,
            end;

        chart1 = Highcharts.chart('container1', {
            chart: {
                zoomType: 'x'
            },
            series: [{
                data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
            }],
            title: {
                text: 'Chart1'
            }
        });
        chart2 = Highcharts.chart('container2', {
            chart: {
                zoomType: 'x'
            },
            series: [{
                data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
            }],
            title: {
                text: 'Chart2'
            }
        });

        Highcharts.each(chart1.axes, function (axis) {
            if (axis.isXAxis) {
                assert.strictEqual(
                    typeof axis.userMin,
                    'undefined',
                    'Chart1 has not zoomed'
                );
            }
        });
        Highcharts.each(chart2.axes, function (axis) {
            if (axis.isXAxis) {
                assert.strictEqual(
                    typeof axis.userMin,
                    'undefined',
                    'Chart2 has not zoomed'
                );
            }
        });

        offset1 = Highcharts.offset(chart1.container);
        offset2 = Highcharts.offset(chart2.container);
        start = offset1.left + chart1.plotLeft + (chart1.plotSizeX / 2);
        end = offset2.left + chart2.plotLeft + (chart2.plotSizeX / 2);
        y = offset1.top + chart1.plotTop + (chart1.plotSizeY / 2);
        // Do a drag and drop
        chart1.pointer.onContainerMouseDown({
            type: 'mousedown',
            pageX: start,
            pageY: y
        });
        chart1.pointer.onContainerMouseMove({
            type: 'mousemove',
            pageX: end,
            pageY: y
        });
        chart1.pointer.onDocumentMouseUp({
            type: 'mouseup',
            pageX: end,
            pageY: y
        });

        // Test after interaction
        Highcharts.each(chart1.axes, function (axis) {
            if (axis.isXAxis) {
                assert.strictEqual(
                    typeof axis.userMin,
                    'number',
                    'Chart1 has zoomed'
                );
            }
        });
        Highcharts.each(chart2.axes, function (axis) {
            if (axis.isXAxis) {
                assert.strictEqual(
                    typeof axis.userMin,
                    'undefined',
                    'Chart2 has still not zoomed'
                );
            }
        });
    });
});