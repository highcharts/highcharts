QUnit.test('Treemap opacity on levels', function (assert) {
    var chart = Highcharts.chart('container', {
            title: {
                text: 'No data in treemap'
            },
            series: [{
                type: 'treemap',
                layoutAlgorithm: "squarified",
                name: 'Random data',
                color: 'rgba(0, 100, 200, 0.4)'
            }]
        }),
        series = chart.series[0];
    // Test when series data is empty
    assert.strictEqual(
        series.hasData(),
        false,
        'Data does not exist, expect series.hasData to return false'
    );

    // Test after series data is added
    series.update({
        data: [1, 2, 3]
    });
    assert.strictEqual(
        series.hasData(),
        true,
        'Data has been added, expect series.hasData to return true'
    );

    // Test with empty data array
    series.update({
        data: []
    });
    assert.strictEqual(
        series.hasData(),
        false,
        'Data array has been emptied, expect series.hasData to return false'
    );
});