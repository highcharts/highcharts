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

    chart.series[0].update({
        tileShape: 'circle'
    });

    var point = chart.series[0].points[1];
    point.setState('hover');

    assert.notEqual(
        point.graphic.element.getAttribute('cx'),
        "NaN",
        "Circle shape of tilemap should not have cx attribute with NaN values on hover."
    );

    assert.notEqual(
        point.graphic.element.getAttribute('cy'),
        "NaN",
        "Circle shape of tilemap should not have cy attribute with NaN values on hover."
    );

});
