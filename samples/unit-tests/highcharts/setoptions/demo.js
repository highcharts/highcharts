QUnit.test('Stock chart specific options in setOptions', function (assert) {

    const xAxis = Highcharts.defaultOptions.xAxis;
    let chart;

    Highcharts.defaultOptions.xAxis = Highcharts.merge(xAxis);


    chart = $('#container')
        .highcharts('StockChart', {
            series: [
                {
                    data: [1, 2, 3]
                }
            ]
        })
        .highcharts();

    assert.strictEqual(
        chart.navigator.enabled &&
            chart.scrollbar.enabled &&
            chart.rangeSelector.enabled,
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
        xAxis: {
            type: 'datetime'
        }
    });

    chart = $('#container')
        .highcharts('StockChart', {
            series: [
                {
                    data: [1, 2, 3]
                }
            ]
        })
        .highcharts();

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
        typeof chart.xAxis[0].dateTime,
        'object',
        'The axis should have dateTime props'
    );

    // Skip this. Default options for corresponding index has never been
    // properly supported, and is now removed. The default options/setOptions
    // should have only a single object for xAxis, yAxis and colorAxis.
    /*
    assert.strictEqual(
        chart.yAxis[0].options.title.text,
        'Custom title',
        'Axis option set as array should apply to corresponding index (#7690)'
    );
    */

    chart = $('#container')
        .highcharts('StockChart', {
            navigator: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            rangeSelector: {
                enabled: false
            },
            series: [
                {
                    data: [1, 2, 3]
                }
            ]
        })
        .highcharts();

    assert.strictEqual(
        chart.navigator && chart.scrollbar && chart.rangeSelector,
        undefined,
        'navigator, scrollbar, rangeSelector disabled'
    );

    // Reset to defaults
    delete Highcharts.defaultOptions.scrollbar.enabled;
    delete Highcharts.defaultOptions.navigator.enabled;
    Highcharts.defaultOptions.rangeSelector.enabled = undefined;
    delete Highcharts.defaultOptions.tooltip.split;
    Highcharts.defaultOptions.xAxis = xAxis;

});
