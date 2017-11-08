QUnit.test('Rangeselector, scrollbar, navigator should be hidden by setOptions.', function (assert) {

    var chart;

    chart = $('#container').highcharts('StockChart', {
        series: [{
            data: [1, 2, 3]
        }]
    }).highcharts();

    assert.strictEqual(
        chart.navigator.enabled && chart.scrollbar.enabled && chart.rangeSelector.enabled,
        undefined,
        'navigator, scrollbar, rangeSelector enabled'
    );

    Highcharts.setOptions({
        scrollbar: {
            enabled: false
        },
        navigator: {
            enabled: false
        },
        rangeSelector: {
            enabled: false
        }
    });

    chart = $('#container').highcharts('StockChart', {
        series: [{
            data: [1, 2, 3]
        }]
    }).highcharts();

    assert.strictEqual(
        chart.navigator && chart.scrollbar && chart.rangeSelector,
        undefined,
        'navigator, scrollbar, rangeSelector disabled'
    );

    chart = $('#container').highcharts('StockChart', {
        navigator: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        },
        rangeSelector: {
            enabled: false
        },
        series: [{
            data: [1, 2, 3]
        }]
    }).highcharts();

    assert.strictEqual(
        chart.navigator && chart.scrollbar && chart.rangeSelector,
        undefined,
        'navigator, scrollbar, rangeSelector disabled'
    );

    // Reset to defaults
    delete Highcharts.defaultOptions.scrollbar.enabled;
    delete Highcharts.defaultOptions.navigator.enabled;
    delete Highcharts.defaultOptions.rangeSelector.enabled;
});