QUnit.test('Test algorithm on data updates.', function (assert) {
    var chart = Highcharts.stockChart('container', {
        series: [{
            id: 'main',
            type: 'ohlc',
            keys: ['high', 'low', 'close'],
            data: [
        [62.34, 61.37, 62.15],
        [62.05, 60.69, 60.81],
        [62.27, 60.10, 60.45],
        [60.79, 58.61, 59.18],
        [59.93, 58.712, 59.24],
        [61.75, 59.86, 60.20],
        [60.00, 57.97, 58.48],
        [59.00, 58.02, 58.24],
        [59.07, 57.48, 58.69],
        [59.22, 58.30, 58.65],
        [58.75, 57.8276, 58.47],
        [58.65, 57.86, 58.02],
        [58.47, 57.91, 58.17],
        [58.25, 57.8333, 58.07],
        [58.35, 57.53, 58.13],
        [59.86, 58.58, 58.94],
        [59.5299, 58.30, 59.10],
        [62.10, 58.53, 61.92],
        [62.16, 59.80, 61.37],
        [62.67, 60.93, 61.68],
        [62.38, 60.15, 62.09],
        [63.73, 62.2618, 62.89],
        [63.85, 63.00, 63.53],
        [66.15, 63.58, 64.01],
        [65.34, 64.07, 64.77],
        [66.48, 65.20, 65.22],
        [65.23, 63.21, 63.28],
        [63.40, 61.88, 62.40],
        [63.18, 61.11, 61.55],
        [62.70, 61.25, 62.69]
            ]
        }, {
            id: 'volume',
            data: [
                7849, 11692, 10575, 13059, 20734, 29630, 17705, 7259, 10475, 5204, 3423, 3962,
                4096, 3766, 4239, 8040, 6957, 18172, 22226, 14614, 12320, 15008, 8880, 22694,
                10192, 10074, 9412, 10392, 8927, 7460
            ]
        }, {
            type: 'cmf',
            linkedTo: 'main',
            params: {
                period: 20
            }
        }]
    });

    function round(array) {
        return Highcharts.map(array, function (value) {
            return value === null ? null : Number(value.toFixed(3));
        });
    }

    var expectedData = [-0.121, -0.100, -0.066, -0.026, -0.062, -0.048, -0.009, -0.009, -0.005, -0.058, -0.015];
    var base = chart.series[0];
    var volume = chart.series[1];
    var indicator = chart.series[2];

    assert.deepEqual(
      round(indicator.yData),
      expectedData,
      'yData is correct after the chart is loaded.'
    );

    base.addPoint({ high: 63, low: 62.5, close: 62.75 }, false);
    volume.addPoint(8000);
    assert.deepEqual(
      round(indicator.yData),
      expectedData.concat(-0.021),
      'yData is correct after add point on the base and the volume series.'
    );


    base.data[base.data.length - 1].update({ high: 64 }, false);
    volume.data[volume.data.length - 1].update({ y: 7500 });
    assert.deepEqual(
      round(indicator.yData),
      expectedData.concat(-0.045),
      'yData is correct after update point on the base and the volume series.'
    );

    base.data[base.data.length - 1].remove(false);
    volume.data[volume.data.length - 1].remove();
    assert.deepEqual(
      round(indicator.yData),
      expectedData,
      'yData is correct after point remove on the base and the volume series.'
    );

    indicator.update({
        params: {
            period: 25
        }
    });
    assert.deepEqual(
      round(indicator.yData),
      [-0.109, -0.158, -0.156, -0.143, -0.141, -0.111],
      'yData is correct after indicator update (period).'
    );

    indicator.remove();
    assert.ok(
      Highcharts.inArray(chart.series, indicator) === -1,
      'Indicator is removed after series remove.'
    );
});
