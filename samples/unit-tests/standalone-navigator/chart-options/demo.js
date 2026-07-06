QUnit.test('Chart options in Standalone Navigator', function (assert) {
    const navigator = Highcharts.navigator('container', {
        chartOptions: {
            chart: {
                height: 250
            },
            credits: {
                enabled: false
            }
        },
        height: 60,
        series: [{
            data: [1, 2, 3, 4]
        }]
    });

    assert.notOk(
        navigator.navigator.chart.credits,
        'Credits should not exist.'
    );

    assert.strictEqual(
        navigator.navigator.chart.container.offsetHeight,
        250,
        'Chart height from chartOptions should size the container, #24715.'
    );

    assert.strictEqual(
        navigator.navigator.height,
        60,
        'Navigator height should be independent from chart height, #24715.'
    );

    navigator.update({
        height: 80
    });

    assert.strictEqual(
        navigator.navigator.chart.container.offsetHeight,
        250,
        'Explicit chart height should be kept after height update, #24715.'
    );

    assert.strictEqual(
        navigator.navigator.height,
        80,
        'Navigator height should be updated independently, #24715.'
    );

    navigator.update({
        chartOptions: {
            chart: {
                inverted: true
            }
        }
    });

    assert.ok(
        navigator.navigator.chart.inverted,
        'Standalone navigator chart should be inverted after chart update.'
    );
});
