QUnit.test('setDerivedData', assert => {
    const { setDerivedData } = Highcharts.seriesTypes.histogram.prototype;
    const ctx = {
        baseSeries: {
            yData: []
        }
    };

    /**
     * setDerivedData should work properly with an empty yData. #11388.
     */
    setDerivedData.call(ctx);
    assert.ok(
        true,
        'Should not error when called with empty yData.'
    );
});
