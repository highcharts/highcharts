const { assert } = require("qunit");

QUnit.module('Projection', function () {

    const Projection = Highcharts._modules['Maps/Projection.js']; // eslint-disable-line no-underscore-dangle

    const testPoints = (assert, projection) => {
        [
            [0, 0],
            [0, -45],
            [45, 0],
            [0, 45],
            [-45, 0]
        ].forEach(coordinates => {
            const result = projection.inverse(projection.forward(coordinates));
            assert.close(
                result[0],
                coordinates[0],
                0.0001,
                `Roundtrip projection of ${coordinates} should result in the ` +
                    'same longitude'
            );
            assert.close(
                result[1],
                coordinates[1],
                0.0001,
                `Roundtrip projection of ${coordinates} should result in the ` +
                    'same latitude'
            );
        });
    };

    // Test the scale near the center of the projection to make sure all
    // projections have comparable zoom levels
    const testScale = (assert, projection) => {
        const x1 = projection.forward([-1, 0]),
            x2 = projection.forward([1, 0]);

        assert.close(
            x2[0] - x1[0],
            2.226389815865471, // precision lost: 2.2263898158654713
            0.0001,
            'X scale should be similar to that of the WebMercator projection'
        );
    };

    Object.keys(Projection.registry).forEach(name => {
        QUnit.test(name, function (assert) {
            const basicProjection = new Projection({ name });
            testPoints(assert, basicProjection);
            testScale(assert, basicProjection);
            testPoints(
                assert,
                new Projection({ name, rotation: [30, 30] })
            );
        });
    });

    // #17139 starts
    const proj4 = window.proj4;

    window.proj4 = undefined;

    const chart = Highcharts.mapChart('container', {
        chart: {
            proj4: proj4
        },

        series: [{
            mapData: Highcharts.maps['countries/gb/gb-all']
        }, {
            type: 'mapbubble',
            data: [{
                z: 10,
                lat: 53,
                lon: 0
            }]
        }]
    });

    chart.transformToLatLon(
        chart.series[1].points[0],
        {
            crs: "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +vunits=m +no_defs",
            jsonmarginX: -999,
            jsonmarginY: 9851,
            jsonres: 15.5,
            scale: 0.000671282186262,
            xoffset: 137.384849029,
            yoffset: 1053130.83361
        }
    );

    assert.ok(
        true,
        'No error should be thrown into the console, #17139.'
    );

    window.proj4 = proj4;
    // #17139 ends
});