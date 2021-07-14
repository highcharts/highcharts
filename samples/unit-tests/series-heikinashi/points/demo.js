QUnit.test('Heikinashi point calculation.', function (assert) {
    const chart = Highcharts.stockChart('container', {
            series: [{
                type: 'heikinashi',
                data: [
                    [3, 5, 6, 3, 6],
                    [4, 8, 9, 3, 4],
                    [6, 18, 24, 12, 18]
                ]
            }]
        }),
        points = chart.series[0].points;

    assert.strictEqual(
        points[0].open,
        5,
        'The first point open should be recalculated.'
    );
    assert.strictEqual(
        points[0].close,
        5.5,
        'The first point close should be recalculated.'
    );
    assert.strictEqual(
        points[0].high,
        6,
        'The first point higs should not be changed.'
    );
    assert.strictEqual(
        points[0].low,
        3,
        'The first point low should not be changed.'
    );

    assert.strictEqual(
        points[1].open,
        5.25,
        `The second point open should be calculated based on the
        previously calculated point.`
    );
    assert.strictEqual(
        points[1].close,
        6,
        `The second point close should be calculated based on the
        current point.`
    );
    assert.strictEqual(
        points[1].high,
        9,
        `The second point high should be calculated based on the
        current and preciously calculated point.`
    );
    assert.strictEqual(
        points[1].low,
        3,
        `The second point low should be calculated based on the
        current and preciously calculated point.`
    );

    assert.strictEqual(
        points[2].high,
        24,
        `The third point high should be calculated based on the
        current and preciously calculated point.`
    );
    assert.strictEqual(
        points[2].low,
        5.625,
        `The third point low should be calculated based on the
        current and preciously calculated point.`
    );
});
