import DataTable from '/base/js/Data/DataTable.js';
import InvertModifier from '/base/js/Data/Modifiers/InvertModifier.js';

QUnit.test('InvertModifier.modify', function (assert) {
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

QUnit.test('InvertModifier.modifyCell', function (assert) {
    const modifier = new InvertModifier(),
        table = new DataTable({
            x: [4, 3, 2, 1, 0],
            y: ['a', 'b', 'c', 'd', 'e']
        });

    table.setModifier(modifier);

    assert.strictEqual(
        table.modified.getRowCount(),
        table.getColumnNames().length,
        'Original and inverted table should have an inverted amount of columns and rows.'
    );

    assert.strictEqual(
        table.modified.getColumnNames().length,
        table.getRowCount() + 1, // because of column 'columns'
        'Original and inverted table should have an inverted amount of rows and columns.'
    );

    assert.strictEqual(
        table.modified.getCell('4', 0),
        0,
        'Inverted table should contain valid value.'
    );

    table.setCell('x', 4, 5);

    assert.strictEqual(
        table.modified.getCell('4', 0),
        5,
        'Inverted table should contain valid value.'
    );
});

QUnit.test('InvertModifier.modifyColumns', function (assert) {
    const modifier = new InvertModifier(),
        table = new DataTable({
            x: [4, 3, 2, 1, 0],
            y: ['a', 'b', 'c', 'd', 'e']
        });

    table.setModifier(modifier);

    assert.deepEqual(
        table.modified.getColumn('3'),
        [1, 'd'],
        'Inverted table should contain valid row as column.'
    );

    table.setColumns({
        y: ['f', 'g', 'h', 'i', 'j']
    });

    assert.deepEqual(
        table.modified.getColumn('3'),
        [1, 'i'],
        'Inverted table should contain valid row as column.'
    );
});

QUnit.test('InvertModifier.modifyRows', function (assert) {
    const modifier = new InvertModifier(),
        table = new DataTable({
            x: [4, 3, 2, 1, 0],
            y: ['a', 'b', 'c', 'd', 'e']
        });

    table.setModifier(modifier);

    assert.strictEqual(
        table.modified.getColumn('5'),
        undefined,
        'Inverted table should not have sixth row.'
    );

    table.setRows([{ x: -1, y: 'f' }]);

    assert.deepEqual(
        table.modified.getColumn('5'),
        [-1, 'f'],
        'Inverted table should have sixth row.'
    );
});
