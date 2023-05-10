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

    Highcharts.Chart.prototype.collectionsWithUpdate.forEach(coll => {
        if (chart.userOptions[coll]) {
            assert.strictEqual(
                chart.userOptions[coll].length,
                chart[coll].length,
                `User options of ${coll} should reflect the collection length`
            );
            assert.strictEqual(
                chart.options[coll].length,
                chart[coll].length,
                `Full options of ${coll} should reflect the collection length`
            );
            chart[coll].forEach((item, i) => {
                assert.strictEqual(
                    chart.userOptions[coll][i],
                    chart[coll][i].userOptions,
                    'Item user options should be reflected in chart user options ' +
                    `(${coll})`
                );
            });
        }
    });

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
