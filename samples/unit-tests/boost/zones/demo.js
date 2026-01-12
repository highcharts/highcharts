QUnit.test('Boost zones with zoneAxis x, #23471', function (assert) {
    const chart = Highcharts.chart('container', {
        series: [
            {
                boostThreshold: 1,
                type: 'scatter',
                data: [
                    [1, 1],
                    [2, 1]
                ],
                zoneAxis: 'x',
                zones: [
                    { color: 'green', value: 1 },
                    { color: 'red', value: 2 }
                ]
            }
        ]
    });

    const series = chart.series[0];

    // Test point [1, 1] should have red color (zone[1])
    const point1 = series.boost.getPoint({ i: 0 });
    const zone1 = point1.getZone();

    assert.strictEqual(
        zone1?.color || point1.color,
        'red',
        'Point [1, 1] should have red color (zone[1])'
    );

    // Test point [2, 1] should have default color (no zone)
    const point2 = series.boost.getPoint({ i: 1 });
    const zone2 = point2.getZone();

    assert.strictEqual(
        zone2.color,
        undefined,
        'Point [2, 1] zone color should be undefined (no zone)'
    );
    assert.strictEqual(
        zone2.fillColor,
        undefined,
        'Point [2, 1] zone fillColor should be undefined (no zone)'
    );
    assert.strictEqual(
        point2.color || series.color,
        series.color,
        'Point [2, 1] should have default series color (no zone)'
    );
});
