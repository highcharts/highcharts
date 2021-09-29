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
});
