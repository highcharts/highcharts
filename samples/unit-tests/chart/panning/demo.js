/* global TestController */
QUnit.test('Zoom and pan key', function (assert) {

    var chart = Highcharts.chart('container', {
            chart: {
                type: 'line',
                zoomType: 'x',
                panning: true,
                panKey: 'shift'
            },

            title: {
                text: 'Zooming and panning'
            },

            subtitle: {
                text: 'Click and drag to zoom in. Hold down shift key to pan.'
            },

            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },

            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }]
        }),
        firstZoom = {};

    var test = TestController(chart);

    chart.setSize(600, 300);


    assert.strictEqual(
        chart.xAxis[0].min,
        0,
        'Initial min'
    );
    assert.strictEqual(
        chart.xAxis[0].max,
        11,
        'Initial max'
    );


    // Zoom
    test.mousedown(200, 150);
    test.mousemove(250, 150);
    test.mouseup();

    assert.strictEqual(
        chart.xAxis[0].min > 0,
        true,
        'Zoomed min'
    );
    assert.strictEqual(
        chart.xAxis[0].max < 11,
        true,
        'Zoomed max'
    );

    firstZoom = chart.xAxis[0].getExtremes();

    // Pan
    test.mousedown(200, 100, { shiftKey: true });
    test.mousemove(150, 100, { shiftKey: true });
    test.mouseup();

    assert.strictEqual(
        chart.xAxis[0].min > firstZoom.min,
        true,
        'Has panned'
    );
    assert.strictEqual(
        chart.xAxis[0].max - chart.xAxis[0].min,
        firstZoom.max - firstZoom.min,
        'Has preserved range'
    );

});