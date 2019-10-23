QUnit.test('Series should be hidden from screen readers when not visible', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                data: [1, 2, 3]
            }, {
                data: [4, 5, 6]
            }]
        }),
        seriesA = chart.series[0],
        seriesB = chart.series[1],
        getSeriesAriaHidden = function (series) {
            return Highcharts.A11yChartUtilities.getSeriesA11yElement(series)
                .getAttribute('aria-hidden');
        };

    assert.strictEqual(
        getSeriesAriaHidden(seriesA),
        'false',
        'Series should not be hidden from AT'
    );
    assert.strictEqual(
        getSeriesAriaHidden(seriesB),
        'false',
        'Series should not be hidden from AT'
    );

    seriesB.hide();

    assert.strictEqual(
        getSeriesAriaHidden(seriesA),
        'false',
        'Series should still not be hidden from AT'
    );
    assert.strictEqual(
        getSeriesAriaHidden(seriesB),
        'true',
        'Series should be hidden from AT'
    );
});
