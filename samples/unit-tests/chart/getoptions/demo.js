QUnit.test('getOptions', assert => {
    const factory = 'chart';

    const options = {
        series: [{
            data: [1, 4, 3, 5],
            type: 'column',
            colorByPoint: true
        }],
        colorAxis: {
            minColor: '#ff0000'
        }
    };
    const chart = Highcharts[factory]('container', options);

    const result = chart.getOptions();

    // Because `getOptions` splats all collections
    options.colorAxis = [options.colorAxis];

    delete result.xAxis;
    delete result.yAxis;

    assert.deepEqual(
        result,
        options,
        'The results should be the same as ingoing options'
    );

    assert.strictEqual(
        chart.userOptions.colorAxis[0],
        chart.colorAxis[0].userOptions,
        'Color axis user options should be shared by reference (remove this if we refactor out userOptions)'
    );

    chart.update({
        legend: {
            enabled: false
        }
    });

    assert.strictEqual(
        chart.getOptions().legend.enabled,
        false,
        'Non-default setting should be part of the result'
    );

    chart.update({
        legend: {
            enabled: true
        }
    });

    assert.strictEqual(
        chart.getOptions().legend,
        undefined,
        'Default setting should not be part of the result, and empty parent purged'
    );

});
