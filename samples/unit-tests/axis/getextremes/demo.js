
QUnit.test('Mouse interaction', function (assert) {

    var chart = Highcharts
        .chart('container', {
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'Events added from Chart prototype'
            },
            subtitle: {
                text: 'Drag and click to view events'
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }]
        });

    chart.setSize(800, 300, false);

    assert.strictEqual(
        chart.xAxis[0].getExtremes().min,
        0,
        'Initial min'
    );

    assert.strictEqual(
        chart.xAxis[0].getExtremes().max,
        11,
        'Initial min'
    );

    // Drag
    var controller = new TestController(chart);

    controller.pan([200, 200], [300, 200]);

    assert.close(
        chart.xAxis[0].getExtremes().min,
        0,
        0.00001,
        'Min should be 0'
    );
    assert.close(
        chart.xAxis[0].getExtremes().max,
        5,
        0.00001,
        'Max should be 5'
    );

});