QUnit.test('Testing addPoint() function - return point #10413', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            data: [3, 4, 5]
        }]
    });

    var point = chart.series[0].addPoint(8);

    assert.strictEqual(
        typeof (point),
        'object',
        'Point should be added to array as an object.'
    );
});