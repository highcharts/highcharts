QUnit.test('Data options must not pollute shared objects', function (assert) {
    // JSON.parse creates `__proto__` and `constructor` as own keys, unlike
    // object literals
    const data = JSON.parse(
        '[{"y":1,"__proto__":{"polluted":"yes"}},' +
        '{"y":2,"constructor":{"polluted":"yes"}}]'
    );

    const chart = Highcharts.chart('container', {
        series: [{
            type: 'column',
            data: data
        }]
    });

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
        chart.series[0].points.map(point => point.y),
        [1, 2],
        'The valid part of the data should still render'
    );

    assert.deepEqual(
        Object.keys(chart.series[0].dataTable.columns),
        ['y'],
        'No columns should be created for the unsafe keys'
    );

    assert.ok(
        chart.series[0].points[0] instanceof Highcharts.Point,
        'The point should keep its prototype'
    );
});
