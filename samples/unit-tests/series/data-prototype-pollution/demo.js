QUnit.test('Data options must not pollute shared objects', function (assert) {
    // JSON.parse keeps `__proto__` and `constructor` as own keys, unlike
    // object literals where they are intercepted by the parser
    const data = JSON.parse(
        '[{"y":1,"__proto__":{"polluted":"yes"}},' +
        '{"y":2,"constructor":{"polluted":"yes"}}]'
    );

    const chart = Highcharts.chart('container', {
        series: [{
            type: 'column'
        }]
    });

    // Skip the redraw to isolate the building of the data columns
    chart.series[0].setData(data, false);

    assert.strictEqual(
        {}[0],
        undefined,
        'Object.prototype should not be written to'
    );

    assert.strictEqual(
        {}.polluted,
        undefined,
        'Object.prototype should not have picked up the payload'
    );

    assert.strictEqual(
        Object[0],
        undefined,
        'The Object constructor should not be written to'
    );

    assert.deepEqual(
        Object.keys(chart.series[0].dataTable.columns),
        ['y'],
        'No columns should be created for the unsafe keys'
    );

    assert.deepEqual(
        Array.from(chart.series[0].getColumn('y')),
        [1, 2],
        'The valid part of the data should still be applied'
    );
});
