QUnit.test('Set basemap on chart object', function (assert) {
    var chart = new Highcharts.MapChart('container', {
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

    chart = new Highcharts.MapChart('container', {
        chart: {
            map: Highcharts.maps['countries/us/us-all']
        },
        series: [{}]
    });

    assert.strictEqual(
        chart.series[0].mapData.length,
        51,
        'Set map on chart object by GeoJSON object'
    );

    chart.update({
        chart: {
            map: 'invalid-map'
        }
    }, false);

    chart.series[0].update({
        mapData: Highcharts.maps['countries/bn-all.js']
    });

    assert.strictEqual(
        chart.series[0].mapData.length,
        51,
        'Map on the series object should overrule chart-wide setting.'
    );

    chart.series[0].update({
        mapData: Highcharts.maps['countries/ad/ad-all']
    });

    assert.strictEqual(
        chart.series[0].mapData.length,
        7,
        'Update new map on series should overrule old series map, #11636.'
    );
});
