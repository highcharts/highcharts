/* global TestController */
QUnit.test('Zoom type', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'line',
            zoomType: 'x',
            width: 600,
            height: 300
        },

        title: {
            text: 'Zooming and panning'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });

    var controller = TestController(chart);


    // Right-click
    controller.mousedown(200, 150, { button: 2 });
    controller.mousemove(250, 150, { button: 2 });
    controller.mouseup();

    assert.strictEqual(
        chart.xAxis[0].min,
        0,
        'Right button drag should not zoom (#1019)'
    );
    assert.strictEqual(
        chart.xAxis[0].max,
        11,
        'Right button drag should not zoom (#1019)'
    );


    // Zoom
    controller.mousedown(200, 150);
    controller.mousemove(250, 150);
    controller.mouseup();
    assert.strictEqual(
        chart.resetZoomButton.zIndex,
        6,
        'The zoom button should have Z index 6, below tooltip (#6096)'
    );


});
