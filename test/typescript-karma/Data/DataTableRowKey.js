import DataTable from '/base/code/es-modules/Data/DataTable.js';
import RangeModifier from '/base/code/es-modules/Data/Modifiers/RangeModifier.js';

QUnit.test('DataTableRowKey.modify', async function (assert) {

    const table = new DataTable({
            columns: {
                x: [ -2, -1, 0, 1, 2 ],
                y: [ 'a', 'b', 'c', 'd', 'e' ],
                z: [ 1e1, 1e2, 1e3, 1e4, 1e5 ]
            },
            rowKeysId: 'rkey'
        }),
        modifier = new RangeModifier();

    const rowKeysId = table.getRowKeysId();
    assert.equal(rowKeysId, 'rkey', 'Row key column should be set');

    const rowKeys = table.getRowKeysColumn();
    assert.equal(rowKeys.length, table.columns.x.length,
        'The number of row keys should equal the number of rows');

    await modifier.modify(table);

    assert.deepEqual(
        table.modified.getRow(0),
        table.getRow(0),
        'Filtered table should contain same rows.'
    );

    modifier.options.ranges.push({
        column: 'y',
        minValue: 'A',
        maxValue: 'b'
    });

    await modifier.modify(table);

    assert.deepEqual(
        table.modified.getColumns(),
        {
            x: [ -2, -1 ],
            y: [ 'a', 'b' ],
            z: [ 10, 100 ]
        },
        'Filtered table should contain reduced number of rows.'
    );

    modifier.options.ranges.push({
        column: 'z',
        minValue: 50,
        maxValue: 100
    });

    await modifier.modify(table);

    assert.deepEqual(
        table.modified.getColumns(),
        {
            x: [ -1 ],
            y: [ 'b' ],
            z: [ 100 ]
        },
        'Filtered table should contain intersective reduction of rows.'
    );

    // Range modifier default options are static.
    // Clear in order not to wreck other tests
    modifier.options.ranges.length = 0;
});

