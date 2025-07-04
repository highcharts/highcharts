QUnit.test('Model choice', function (assert) {
    const chart = Highcharts.chart('container', {
        tooltip: {
            enabled: false
        },
        series: [{
            data: [1, 2, 3]
        }]
    });
    let a11yInstance = chart.a11y;

    assert.strictEqual(
        a11yInstance.model,
        'summary',
        'Default summary model is chosen for simple chart'
    );

    chart.series[0].addPoint(4);

    assert.strictEqual(
        chart.a11y.model,
        'list',
        'Default model is adapted to new data'
    );

    assert.notStrictEqual(
        a11yInstance,
        chart.a11y,
        'A11y module was re-initialized on model change'
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

    a11yInstance = chart.a11y;
    chart.addSeries({
        data: [1, 2, 4]
    });

    assert.strictEqual(
        a11yInstance,
        chart.a11y,
        'A11y module was not re-initialized on data change without model change'
    );
});
