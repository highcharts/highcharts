QUnit.test('Stock chart specific options in setOptions', function (assert) {

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
        },
        tooltip: {
            split: false
        },
        yAxis: [{
            title: {
                text: 'Custom title'
            }
        }]
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
    chart.series[0].points[0].onMouseOver();

    assert.strictEqual(
        chart.tooltip.split,
        false,
        'The instanciated tooltip should not be split (#7307)'
    );

    assert.strictEqual(
        chart.yAxis[0].options.title.text,
        'Custom title',
        'Axis option set as array should apply to corresponding index (#7690)'
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
    delete Highcharts.defaultOptions.tooltip.split;
    delete Highcharts.defaultOptions.yAxis;
});