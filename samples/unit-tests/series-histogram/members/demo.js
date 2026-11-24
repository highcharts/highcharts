QUnit.test('setDerivedData', assert => {
    /**
     * setDerivedData should work properly with an empty yData. #11388.
     */
    const chart = Highcharts.chart('container', {
        series: [{
            type: 'histogram',
            baseSeries: 1
        }, {
            data: [1, 2, 2, 3, 3, 3, 4, 4, 5, 5, 6]
        }]
    });

    chart.series[0].setData([]);

    assert.ok(
        true,
        'Should not error when called with empty yData.'
    );

    chart.series[1].setData([]);

    assert.strictEqual(
        chart.series[0].getColumn('y').length,
        0,
        'Emptying the base series should empty the histogram without ' +
        'recursive redraws, #20298.'
    );

    const base = chart.addSeries({ id: 'base', data: [1, 1, 1, 1] }, false),
        histogram = chart.addSeries({
            type: 'histogram',
            baseSeries: 'base',
            binsNumber: 2
        }, false);

    base.setData([1, 2, 3, 4, 5, 6, 7, 8], false);
    chart.redraw();

    assert.deepEqual(
        Array.from(histogram.getColumn('y')),
        [4, 4],
        'Histogram should use the data set before the base series rendered, ' +
        '#20298.'
    );
});
