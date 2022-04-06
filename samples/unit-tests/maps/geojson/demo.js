QUnit.test('GeoJSON and map transforms', assert => {

    const chart = Highcharts.mapChart('container', {
        chart: {
            map: 'custom/world'
        },
        series: [{
        }]
    });

    const proj4 = window.proj4;

    [
        'with projection from window.proj4',
        'with proj from chart.proj4' // #17139
    ].forEach((testDescription, iteration) => {
        [
            { lon: 0, lat: 0 },
            { lon: 0, lat: 60 },
            { lon: 90, lat: 0 },
            { lon: 0, lat: -60 },
            { lon: -90, lat: 0 }
        ].forEach(lonLat => {
            const projected = chart.fromLatLonToPoint(lonLat),
                result = chart.fromPointToLatLon(projected);
            assert.close(
                result.lon,
                lonLat.lon,
                0.001,
                `Roundtrip conversion of [${lonLat.lon}, ${lonLat.lat}] ` +
                    'should result in the same lon value ' + testDescription
            );
            assert.close(
                result.lat,
                lonLat.lat,
                0.001,
                `Roundtrip conversion of [${lonLat.lon}, ${lonLat.lat}] ` +
                    'should result in the same lat value ' + testDescription
            );
        });

        if (iteration === 0) {
            window.proj4 = undefined;

            chart.update({
                chart: {
                    proj4: proj4
                }
            }, false);
        } else {
            window.proj4 = proj4;
        }
    });
});