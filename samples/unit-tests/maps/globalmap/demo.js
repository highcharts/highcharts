

QUnit.test('Set basemap on chart object', function (assert) {
    var chart = new Highcharts.Map('container', {
        chart: {
            map: 'countries/ad/ad-all'
        },
        series: [{}]
    });
    assert.strictEqual(
        chart.series[0].mapData.length,
        7,
        'Set map on chart object by string'
    );

    chart = new Highcharts.Map('container', {
        chart: {
            map: Highcharts.maps['countries/ad/ad-all']
        },
        series: [{}]
    });
    assert.strictEqual(
        chart.series[0].mapData.length,
        7,
        'Set map on chart object by GeoJSON object'
    );

    chart = new Highcharts.Map('container', {
        chart: {
            map: 'invalid-map'
        },
        series: [{
            mapData: Highcharts.maps['countries/ad/ad-all']
        }]
    });
    assert.strictEqual(
        chart.series[0].mapData.length,
        7,
        'Map on series object overrules chart-wide setting'
    );
});