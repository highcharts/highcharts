QUnit.test('Percentage inner size', function (assert) {
    var series = Highcharts.charts[0].series[0],
        innerSize = series.options.innerSize;

    assert.equal(
        series.center[3],
        series.center[2] * parseInt(innerSize, 10) / 100,
        'Inner size should be 50% of outer size'
    );

});