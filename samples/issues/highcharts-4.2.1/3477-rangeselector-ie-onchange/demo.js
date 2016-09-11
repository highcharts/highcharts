jQuery(function () {
    QUnit.test('RangeSelector update extremes on enter', function (assert) {
        var $min,
            $enter = jQuery.Event('keypress', { keyCode: 13 }),
            chart = Highcharts.stockChart('container', {
                series: [{
                    data: usdeur
                }]
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
});