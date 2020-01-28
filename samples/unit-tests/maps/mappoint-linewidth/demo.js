// This should maybe be a visual test
QUnit.test('MapPoint with LineWidth', function (assert) {
    var proj4Script = window.proj4;
    window.proj4 = null;

    var chart = Highcharts.mapChart('container', {
        chart: {
            proj4: proj4Script
        },
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
    assert.strictEqual(
        chart.series[1].graph['stroke-width'],
        2,
        'Points have stroke width'
    );
    assert.strictEqual(
        Math.round(chart.series[1].data[0].y),
        -770,
        'The proj4 library was loaded correctly from the chart.proj4 property'
    );

    window.proj4 = proj4Script;
});