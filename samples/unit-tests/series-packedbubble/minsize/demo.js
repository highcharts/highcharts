QUnit.test('Bubble min size', function (assert) {
    var data,
        chart = Highcharts.chart('container', {
            chart: {
                type: 'packedbubble'
            },
            plotOptions: {
                packedbubble: {
                    minSize: 50,
                    maxSize: 50
                }
            },
            series: [{
                data: [20, 15, 3]
            }]
        });

    data = chart.series[0].data;

    assert.strictEqual(
        data[0].marker.radius === data[1].marker.radius &&
        data[1].marker.radius === data[2].marker.radius,
        true,
        'Radius are the same.'
    );
});