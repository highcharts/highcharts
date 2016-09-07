QUnit.test('stateMarkerGraphic', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                data: [{
                    y: 1,
                    color: 'red'
                }, {
                    y: 2,
                    color: 'blue'
                }],
                marker: {
                    radius: 1
                }
            }],
            xAxis: {
                minRange: 15000000000
            }
        }),
        series = chart.series[0],
        point = series.points[0];
    point.setState('hover');
    assert.strictEqual(
        series.stateMarkerGraphic.element.getAttribute('fill'),
        'red',
        'stateMarkerGraphic should have fill: "red" when hovering first point.'
    );

    // Test with second point
    point = series.points[1];
    point.setState('hover');
    assert.strictEqual(
        series.stateMarkerGraphic.element.getAttribute('fill'),
        'blue',
        'stateMarkerGraphic should have fill: "blue" when hovering second point.'
    );
});
