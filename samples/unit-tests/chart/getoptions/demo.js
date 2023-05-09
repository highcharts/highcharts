QUnit.test('getOptions', assert => {
    const factory = 'chart';

    const options = {
        series: [{
            data: [1, 4, 3, 5],
            type: 'column',
            colorByPoint: true
        }]
    };
    const chart = Highcharts[factory]('container', options);

    const result = chart.getOptions();

    delete result.xAxis;
    delete result.yAxis;

    assert.deepEqual(
        result,
        options,
        'The results should be the same as ingoing options'
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
