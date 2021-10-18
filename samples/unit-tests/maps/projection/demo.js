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
                0.0000001,
                `Roundtrip projection of ${coordinates} should result in the ` +
                    'same longitude'
            );
            assert.close(
                result[1],
                coordinates[1],
                0.0000001,
                `Roundtrip projection of ${coordinates} should result in the ` +
                    'same latitude'
            );
        });
    };

    Object.keys(Projection.registry).forEach(name => {
        QUnit.test(name, function (assert) {
            testPoints(
                assert,
                new Projection({ name })
            );
            testPoints(
                assert,
                new Projection({ name, rotation: [30, 30] })
            );
        });
    });

});