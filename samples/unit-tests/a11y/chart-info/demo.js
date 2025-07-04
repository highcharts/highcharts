QUnit.test('Titles', function (assert) {
    const chart = Highcharts.chart('container', {
        title: {
            text: null
        },
        series: [{
            data: [1, 2, 3]
        }]
    });

    assert.strictEqual(
        chart.a11y.chartDescriptionInfo.chartTitle,
        'Chart',
        'Default chart title is picked up from lang options'
    );

    assert.strictEqual(
        chart.a11y.chartDescriptionInfo.chartSubtitle,
        '',
        'No subtitle'
    );

    const a11yInstance = chart.a11y;
    chart.update({
        title: {
            text: 'My chart<br>with special chars'
        }
    });

    assert.strictEqual(
        chart.a11y.chartDescriptionInfo.chartTitle,
        'My chart<br>with special chars',
        'Title matches chart'
    );

    assert.notStrictEqual(
        a11yInstance,
        chart.a11y,
        'A11y module was re-initialized on chart update'
    );
});
