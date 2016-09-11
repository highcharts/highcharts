QUnit.test('getUnionExtremes', function (assert) {
    var chart = Highcharts.stockChart('container', {
            series: [{
                marker: {
                    enabled: true
                },
                data: [[1451952000000, 354652]]
            }]
        }),
        unionExtremes = chart.scroller.getUnionExtremes(),
        extremes = chart.xAxis[0].getExtremes();

    assert.strictEqual(
        unionExtremes.dataMin,
        extremes.min,
        'getUnionExtremes.min equals getExtremes.min'
    );
    assert.strictEqual(
        unionExtremes.dataMax,
        extremes.max,
        'getUnionExtremes.max equals getExtremes.max'
    );
});
