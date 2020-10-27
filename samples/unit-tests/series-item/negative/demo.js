QUnit.test('Item series negative values', assert => {
    const { series: [series] } = Highcharts.chart('container', {
        series: [{
            type: 'item',
            data: [1, -1, 0, 3]
        }]
    });

    var item = series;

    assert.ok(item, 'Item series initialised');

    assert.strictEqual(
        series.data[0].y,
        1,
        'The value of y should be 1'
    );

    assert.strictEqual(
        series.data[1].y,
        -1,
        'The value of y should be -1.'
    );

    assert.strictEqual(
        series.data[2].y,
        0,
        'The value of y should be 0'
    );

    assert.strictEqual(
        series.data[3].y,
        3,
        'The value of y should be 3'

    );

    assert.strictEqual(
        series.data[0].percentage,
        25,
        'The point is displayed in the chart with an amount of 25 percent.'
    );

    assert.strictEqual(
        series.data[1].percentage,
        -25,
        "The point is not displayed in the chart because the percentage is negative."
    );

    assert.strictEqual(
        series.data[2].percentage,
        0,
        'The point is not displayed in the chart because it is zero.'
    );

    assert.strictEqual(
        series.data[3].percentage,
        75,
        'The point is displayed in the chart with an amount of 75 percent.'
    );

});
