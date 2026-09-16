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

QUnit.test('Nested data keys must not pollute Object.prototype', function (
    assert
) {
    // Dotted keys are expanded by `setNestedProperty`, which walked into
    // whatever the segment resolved to. For `__proto__` that is the shared
    // `Object.prototype`, so the last segment landed on every object
    const data = JSON.parse(
        '[{"y":1,"__proto__.polluted":"yes"},' +
        '{"y":2,"constructor.prototype.polluted":"yes"}]'
    );

    const chart = Highcharts.chart('container', {
        series: [{
            type: 'column'
        }]
    });

    // The nested key handling only runs when the series has no `data` option
    // of its own, which is the case until `setData` has returned
    chart.series[0].setData(data, false);

    assert.strictEqual(
        {}.polluted,
        undefined,
        'Object.prototype should not have picked up the nested payload'
    );

    assert.deepEqual(
        Object.keys(chart.series[0].dataTable.columns),
        ['y'],
        'No columns should be created for the unsafe nested keys'
    );

    assert.deepEqual(
        Array.from(chart.series[0].getColumn('y')),
        [1, 2],
        'The valid part of the data should still be applied'
    );
});

QUnit.test('Inherited data keys must not mutate built-ins', function (assert) {
    // `columns.toString` is truthy through the prototype chain without being
    // a column, so a truthiness test let the write land on the shared
    // `Object.prototype.toString`
    const data = JSON.parse(
        '[{"y":1,"toString":"a"},{"y":2,"toString":"b"}]'
    );

    const chart = Highcharts.chart('container', {
        series: [{
            type: 'column'
        }]
    });

    chart.series[0].setData(data, false);

    assert.strictEqual(
        Object.prototype.toString[0],
        undefined,
        'Object.prototype.toString should not be written to'
    );

    assert.strictEqual(
        typeof {}.toString,
        'function',
        'Object.prototype.toString should still be a function'
    );

    assert.deepEqual(
        Array.from(chart.series[0].getColumn('toString')),
        ['a', 'b'],
        'The inherited key should become a column of its own'
    );

    assert.deepEqual(
        Array.from(chart.series[0].getColumn('y')),
        [1, 2],
        'The valid part of the data should still be applied'
    );
});
