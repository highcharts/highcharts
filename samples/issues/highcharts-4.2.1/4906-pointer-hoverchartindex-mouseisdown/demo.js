$(function () {
    QUnit.test('Do not change hoverChartIndex during a drag.', function (assert) {
        var chart1,
            chart2,
            axis;

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

        // Do a drag and drop
        chart1.pointer.onContainerMouseDown({
            type: 'mousedown',
            pageX: 500,
            pageY: 600
        });
        chart1.pointer.onContainerMouseMove({
            type: 'mousemove',
            pageX: 900,
            pageY: 600
        });
        chart1.pointer.onDocumentMouseUp({
            type: 'mouseup',
            pageX: 900,
            pageY: 600
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