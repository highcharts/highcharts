import DataTable from '/base/js/Data/DataTable.js';
import InvertModifier from '/base/js/Data/Modifiers/InvertModifier.js';

QUnit.test('InvertModifier.execute', function (assert) {

    const modifier = new InvertModifier(),
        table = new DataTable({
            x: [ 0, 1, 2, 3, 4 ],
            y: [ 'a', 'b', 'c', 'd', 'e' ]
        }),
        tableColumnNames = table.getColumnNames(),
        invertedTable = modifier.modify(table.clone());

    assert.notStrictEqual(
        invertedTable,
        table,
        'The inverted table should be a new table instance.'
    );

    assert.strictEqual(
        invertedTable.getRowCount(),
        tableColumnNames.length,
        'Original and inverted table should have an inverted amount of columns and rows.'
    );

    assert.deepEqual(
        invertedTable.getColumn('columnNames'),
        tableColumnNames,
        'Row names of inverted table should be the same as column names of original table.'
    );

    assert.deepEqual(
        modifier.modify(invertedTable.clone()).toJSON(),
        table.toJSON(),
        'Double inverted table should be the same as original table.'
    );
});
