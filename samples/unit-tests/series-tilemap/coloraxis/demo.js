QUnit.test('Tilemap and ColorAxis', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                type: 'tilemap'
            },
            colorAxis: {},
            series: [{
                data: [{
                    x: 0,
                    y: 0,
                    value: 0.02
                }, {
                    x: 25,
                    y: 15,
                    value: 0.06
                }]
            }]
        }),
        extremes = chart.colorAxis[0].getExtremes();

    assert.strictEqual(
        extremes.min,
        0.02,
        'ColorAxis.min should be the same as min value in points (#11644)'
    );

    assert.strictEqual(
        extremes.max,
        0.06,
        'ColorAxis.max should be the same as max value in points (#11644)'
    );

});
