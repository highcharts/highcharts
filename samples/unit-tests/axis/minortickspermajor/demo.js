QUnit.test('Minor ticks per major - linear axis', function (assert) {
    const chart = Highcharts.chart('container', {
        yAxis: {
            minorTicks: true,
            minorTicksPerMajor: 3
        },
        series: [{
            data: [1, 4, 3, 5]
        }]
    });

    const yAxis = chart.yAxis[0];

    assert.strictEqual(
        yAxis.minorTickInterval,
        yAxis.tickInterval / 3,
        'Minor tick interval should be correctly calculated on linear axes'
    );
});

QUnit.test('Minor ticks per major - logarithmic axis', function (assert) {
    const chart = Highcharts.chart('container', {
        yAxis: {
            minorTicks: true,
            tickInterval: 1,
            minorTicksPerMajor: 3,
            type: 'logarithmic'
        },
        series: [{
            data: [1, 10, 100]
        }]
    });

    const yAxis = chart.yAxis[0];

    assert.strictEqual(
        yAxis.minorTickInterval,
        yAxis.tickInterval / 3,
        'Minor tick interval should be correctly calculated on logarithmic axes'
    );
});

QUnit.test('Minor ticks per major - datetime axis', function (assert) {
    const chart = Highcharts.chart('container', {
        xAxis: {
            minorTicks: true,
            tickInterval: 3600000 * 24,
            minorTicksPerMajor: 3,
            type: 'datetime'
        },
        series: [{
            data: [
                [Date.UTC(2020, 0, 1), 1],
                [Date.UTC(2020, 0, 2), 2],
                [Date.UTC(2020, 0, 3), 3]
            ]
        }]
    });

    const xAxis = chart.xAxis[0];

    assert.strictEqual(
        xAxis.minorTickInterval,
        xAxis.tickInterval / 3,
        'Minor tick interval should be correctly calculated on datetime axes'
    );
});
