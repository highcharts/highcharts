QUnit.test('Model choice', function (assert) {
    const chart = Highcharts.chart('container', {
        series: [{
            data: [1, 2, 3]
        }]
    });

    assert.strictEqual(
        chart.a11y.model,
        'summary',
        'Default summary model is chosen for simple chart'
    );

    chart.series[0].addPoint(4);

    assert.strictEqual(
        chart.a11y.model,
        'list',
        'Default model is adapted to new data'
    );

    chart.addSeries({
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    });

    assert.strictEqual(
        chart.a11y.model,
        'application',
        'Default model is adapted to more complex data'
    );

    chart.update({
        a11y: {
            model: 'summary'
        }
    });

    assert.strictEqual(
        chart.a11y.model,
        'summary',
        'Model is hardcoded'
    );
});
