QUnit.test('Series should be hidden from screen readers when not visible', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                data: [1, 2, 3]
            }, {
                data: [4, 5, 6]
            }]
        }),
        seriesComponent = chart.accessibility.components.series,
        seriesA = chart.series[0],
        seriesB = chart.series[1];

    assert.strictEqual(
        seriesComponent.getSeriesElement(seriesA).getAttribute('aria-hidden'),
        'false',
        'Series should not be hidden from AT'
    );
    assert.strictEqual(
        seriesComponent.getSeriesElement(seriesB).getAttribute('aria-hidden'),
        'false',
        'Series should not be hidden from AT'
    );

    seriesB.hide();

    assert.strictEqual(
        seriesComponent.getSeriesElement(seriesA).getAttribute('aria-hidden'),
        'false',
        'Series should still not be hidden from AT'
    );
    assert.strictEqual(
        seriesComponent.getSeriesElement(seriesB).getAttribute('aria-hidden'),
        'true',
        'Series should be hidden from AT'
    );
});
