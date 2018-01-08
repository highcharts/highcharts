/* global TestController */
QUnit.test("Drag panes on zoomable chart", function (assert) {
    var chart = Highcharts.stockChart('container', {
            chart: {
                zoomType: 'x',
                type: 'column'
            },
            xAxis: [{
                minRange: 0.0001
            }],
            yAxis: [{
                height: '60%',
                resize: {
                    enabled: true,
                    lineWidth: 20
                }
            }, {
                top: '65%',
                height: '35%'
            }],
            series: [{
                data: [3, 2, 1]
            }, {
                data: [1, 2, 3],
                yAxis: 1
            }]
        }),
        controller = new TestController(chart);

    // Drag
    controller.mousedown(200, 190);
    controller.mousemove(260, 100);
    controller.mouseup();

    assert.equal(
        chart.xAxis[0].getExtremes().min,
        0,
        "Zoom not triggered when dragging panes (#7563)"
    );
});