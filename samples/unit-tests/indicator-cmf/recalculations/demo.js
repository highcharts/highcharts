QUnit.test('Test algorithm on data updates.', function (assert) {
    var chart = Highcharts.stockChart('container', {
        series: [
            {
                id: 'main',
                type: 'ohlc',
                keys: ['high', 'low', 'close'],
                data: [
                    [62.34, 61.37, 62.15],
                    [62.05, 60.69, 60.81],
                    [62.27, 60.1, 60.45],
                    [60.79, 58.61, 59.18],
                    [59.93, 58.712, 59.24],
                    [61.75, 59.86, 60.2],
                    [60.0, 57.97, 58.48],
                    [59.0, 58.02, 58.24],
                    [59.07, 57.48, 58.69],
                    [59.22, 58.3, 58.65],
                    [58.75, 57.8276, 58.47],
                    [58.65, 57.86, 58.02],
                    [58.47, 57.91, 58.17],
                    [58.25, 57.8333, 58.07],
                    [58.35, 57.53, 58.13],
                    [59.86, 58.58, 58.94],
                    [59.5299, 58.3, 59.1],
                    [62.1, 58.53, 61.92],
                    [62.16, 59.8, 61.37],
                    [62.67, 60.93, 61.68],
                    [62.38, 60.15, 62.09],
                    [63.73, 62.2618, 62.89],
                    [63.85, 63.0, 63.53],
                    [66.15, 63.58, 64.01],
                    [65.34, 64.07, 64.77],
                    [66.48, 65.2, 65.22],
                    [65.23, 63.21, 63.28],
                    [63.4, 61.88, 62.4],
                    [63.18, 61.11, 61.55],
                    [62.7, 61.25, 62.69]
                ]
            },
            {
                id: 'volume',
                data: [
                    7849,
                    11692,
                    10575,
                    13059,
                    20734,
                    29630,
                    17705,
                    7259,
                    10475,
                    5204,
                    3423,
                    3962,
                    4096,
                    3766,
                    4239,
                    8040,
                    6957,
                    18172,
                    22226,
                    14614,
                    12320,
                    15008,
                    8880,
                    22694,
                    10192,
                    10074,
                    9412,
                    10392,
                    8927,
                    7460
                ]
            },
            {
                type: 'cmf',
                linkedTo: 'main',
                params: {
                    period: 20
                }
            }
        ]
    });

    function round(array) {
        return array.map(value =>
            (value === null ? null : Number(value.toFixed(3)))
        );
    }

    var expectedData = [
        -0.121,
        -0.1,
        -0.066,
        -0.026,
        -0.062,
        -0.048,
        -0.009,
        -0.009,
        -0.005,
        -0.058,
        -0.015
    ];
    var base = chart.series[0];
    var volume = chart.series[1];
    var indicator = chart.series[2];

    assert.deepEqual(
        round(indicator.getColumn('y')),
        expectedData,
        'yData is correct after the chart is loaded.'
    );

    base.addPoint({ high: 63, low: 62.5, close: 62.75 }, false);
    volume.addPoint(8000);
    assert.deepEqual(
        round(indicator.getColumn('y')),
        expectedData.concat(-0.021),
        'yData is correct after add point on the base and the volume series.'
    );

    base.data[base.data.length - 1].update({ high: 64 }, false);
    volume.data[volume.data.length - 1].update({ y: 7500 });
    assert.deepEqual(
        round(indicator.getColumn('y')),
        expectedData.concat(-0.045),
        'yData is correct after update point on the base and the volume series.'
    );

    base.data[base.data.length - 1].remove(false);
    volume.data[volume.data.length - 1].remove();
    assert.deepEqual(
        round(indicator.getColumn('y')),
        expectedData,
        'yData is correct after point remove on the base and the volume series.'
    );

    indicator.update({
        params: {
            period: 25
        }
    });
    assert.deepEqual(
        round(indicator.getColumn('y')),
        [-0.109, -0.158, -0.156, -0.143, -0.141, -0.111],
        'yData is correct after indicator update (period).'
    );

    indicator.remove();
    assert.ok(
        chart.series.indexOf(indicator) === -1,
        'Indicator is removed after series remove.'
    );

    while (chart.series.length) {
        chart.series[0].remove(false);
    }
    chart.addSeries({
        id: 'main',
        data: []
    }, false);
    chart.addSeries({
        type: 'cmf',
        linkedTo: 'main'
    });

    assert.ok(
        true,
        `No errors when adding indicator linkedTo a series with empty dataset
        (#18176, #18177).`
    );
});
