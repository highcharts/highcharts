
// This should maybe be a visual test
QUnit.test('MapPoint with LineWidth', function (assert) {
    var chart = Highcharts.mapChart('container', {
        series: [{
            mapData: Highcharts.maps['countries/gb/gb-all']
        }, {
            type: 'mappoint',
            lineWidth: 2,
            data: [{
                lat: 51.507222,
                lon: -0.1275
            }, {
                lat: 52.483056,
                lon: -1.893611
            }, {
                x: 1600,
                y: -3500
            }, {
                x: 2800,
                y: -3800
            }]
        }]
    });
    assert.strictEqual(chart.series[1].graph['stroke-width'],
        2,
        'Points have stroke width'
    );
});