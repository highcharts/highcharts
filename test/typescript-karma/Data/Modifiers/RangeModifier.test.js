import DataTable from '/base/code/es-modules/Data/DataTable.js';
import RangeModifier from '/base/code/es-modules/Data/Modifiers/RangeModifier.js';

QUnit.test('RangeModifier.modify', async function (assert) {

    const table = new DataTable({
            columns: {
                x: [ -2, -1, 0, 1, 2 ],
                y: [ 'a', 'b', 'c', 'd', 'e' ],
                z: [ 1e1, 1e2, 1e3, 1e4, 1e5 ]
            }
        }),
        modifier = new RangeModifier();

    await modifier.modify(table);

    assert.deepEqual(
        table.getModified().getRow(0),
        table.getRow(0),
        'Filtered table should contain same rows.'
    );

    modifier.options.start = 1;
    modifier.options.end = 3;

    await modifier.modify(table);

    assert.deepEqual(
        table.getModified().getColumns(),
        {
            x: [ -1, -0 ],
            y: [ 'b', 'c' ],
            z: [ 1e2, 1e3 ]
        },
        'Filtered table should contain reduced number of rows.'
    );

    modifier.options.start = 4;
    modifier.options.end = void 0;

    await modifier.modify(table);

    assert.deepEqual(
        table.getModified().getColumns(),
        {
            x: [ 2 ],
            y: [ 'e' ],
            z: [ 1e5 ]
        },
        'Filtered table should contain intersective reduction of rows.'
    );

    assert.deepEqual(
        table.getModified().localRowIndexes,
        [ void 0, void 0, void 0, void 0, 0 ],
        'Local row indexes should be set correctly.'
    )

    assert.deepEqual(
        table.getModified().originalRowIndexes,
        [4],
        'Original row indexes should be set correctly.'
    );

});
