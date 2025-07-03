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
        chart.a11y.chartInfo.title,
        'Chart',
        'Default chart title is picked up from lang options'
    );

    assert.strictEqual(
        chart.a11y.chartInfo.subtitle,
        '',
        'No subtitle'
    );

    chart.update({
        title: {
            text: 'My chart<br>with special chars'
        }
    });

    assert.strictEqual(
        chart.a11y.chartInfo.title,
        'My chart<br>with special chars',
        'Title matches chart'
    );
});
