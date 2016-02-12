jQuery(function () {
    QUnit.test('RangeSelector update extremes on enter', function (assert) {
        var $min,
            $max,
            $enter = jQuery.Event('keypress', { keyCode: 13 }),
            chart = Highcharts.stockChart('container', {
                series: [{
                    data: usdeur
                }]
            });
        $min = jQuery('.highcharts-range-selector[name="min"]');
        $max = jQuery('.highcharts-range-selector[name="max"]');
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