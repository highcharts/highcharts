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

});

QUnit.test('Recommend map view for map chart.', async function (assert) {
    const world = await fetch(
            'https://code.highcharts.com/mapdata/custom/world-continents.topo.json'
        ).then(response => response.json()),
        africa = await fetch(
            'https://code.highcharts.com/mapdata/custom/africa.topo.json'
        ).then(response => response.json());


    const chart = Highcharts.mapChart('container', {
        chart: {
            map: world
        },
        series: [{
            data: [['af', 1]]
        }]
    });

    assert.strictEqual(
        chart.mapView.projection.options.name,
        'EqualEarth',
        `Recommended map projection for big (e.g. world) map should be Equal
        Earth.`
    );

    chart.update({
        chart: {
            map: africa
        },
        series: [{
            data: [['ug', 1]]
        }]
    });

    assert.strictEqual(
        chart.mapView.projection.options.name,
        'LambertConformalConic',
        `Recommended map projection for smaller maps should be
        LambertConformalConic.`
    );

    chart.series[0].update({
        mapData: world,
        data: [['af', 1]]
    });

    assert.strictEqual(
        chart.mapView.projection.options.name,
        'EqualEarth',
        `If chart.map is set to small mapData, but series mapData is a big map,
        then recommended projection should be EqualEarth.`
    );
});