QUnit.test('RangeSelector update extremes on enter (#3477)', function (assert) {
    const data = new Array(3000).fill(1).map((item, i) => [
        Date.UTC(2010, 0, 1) + i * 24 * 36e5,
        Math.random()
    ]);

    var $min,
        $enter = jQuery.Event('keypress', { keyCode: 13 }),
        chart = Highcharts.stockChart('container', {
            series: [
                {
                    data
                }
            ]
        });
    $min = jQuery('.highcharts-range-selector[name="min"]');
    assert.strictEqual(
        typeof chart.xAxis[0].userMin,
        'undefined',
        'setExtremes is not called yet'
    );
    jQuery($min).val('2010-10-10');
    $min.trigger($enter);
    assert.strictEqual(
        chart.xAxis[0].userMin,
        1286668800000,
        'Timestamp is a match'
    );
});
