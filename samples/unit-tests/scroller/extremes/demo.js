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

QUnit.test('Extremes with selected button: #6383', function (assert) {
    var now = +new Date(),
        chart = Highcharts.stockChart('container', {
            xAxis: {
                min: 5,
                max: 10
            },
            series: [{
                data: [1, 2, 3, 4, 5, 6, 3, 8, 9, 1]
            }]
        }),
        extremes = chart.xAxis[0].getExtremes(),
        newExtremes;

    chart.series[0].update({
        marker: {
            enabled: true
        }
    });
    chart.series[0].addPoint(10, true, true);
    newExtremes = chart.xAxis[0].getExtremes();

    assert.strictEqual(
        extremes.max - extremes.min,
        newExtremes.max - newExtremes.min,
        'Range in navigator is fine.'
    );
});
