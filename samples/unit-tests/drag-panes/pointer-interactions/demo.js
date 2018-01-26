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
            }],
            series: [{
                data: [3, 2, 1]
            }]
        }),
        controller = new TestController(chart),
        strartingNavYAxisLen = chart.yAxis[1].len;

    // Drag
    controller.mousedown(200, 190);
    controller.mousemove(260, 100);
    controller.mouseup();

    assert.equal(
        chart.yAxis[1].len,
        strartingNavYAxisLen,
        "Don't change navigator's yAxis (#7732)"
    );

    assert.equal(
        chart.xAxis[0].getExtremes().min,
        0,
        "Zoom not triggered when dragging panes (#7563)"
    );
});