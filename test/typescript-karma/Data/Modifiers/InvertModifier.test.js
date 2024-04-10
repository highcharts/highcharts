import DataTable from '/base/code/es-modules/Data/DataTable.js';
import InvertModifier from '/base/code/es-modules/Data/Modifiers/InvertModifier.js';

QUnit.test('InvertModifier.modify', function (assert) {

    const done = assert.async(),
        modifier = new InvertModifier();

    modifier
        .modify(new DataTable({
            columns: {
                x: [ 0, 1, 2, 3, 4 ],
                y: [ 'a', 'b', 'c', 'd', 'e' ]
            }
        }))
        .then((table) => {

            const tableColumnNames = table.getColumnNames();

            assert.notStrictEqual(
                table.modified,
                table,
                'The inverted table should be a new table instance.'
            );

            assert.strictEqual(
                table.modified.getRowCount(),
                tableColumnNames.length,
                'Original and inverted table should have an inverted amount of columns and rows.'
            );

            assert.deepEqual(
                table.modified.getColumn('columnNames'),
                tableColumnNames,
                'Row names of inverted table should be the same as column names of original table.'
            );

            return modifier
                .modify(table.modified.clone())
                .then((modified) =>
                    assert.deepEqual(
                        modified.modified.getColumns(),
                        table.getColumns(),
                        'Double inverted table should be the same as original table.'
                    )
                );

        })
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );

});

QUnit.test('InvertModifier.modifyCell', function (assert) {

    const done = assert.async(),
        modifier = new InvertModifier(),
        table = new DataTable({
            columns: {
                x: [4, 3, 2, 1, 0],
                y: ['a', 'b', 'c', 'd', 'e']
            }
        });

    table
        .setModifier(modifier)
        .then((table) => {

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

        })
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );

});

QUnit.test('InvertModifier.modifyColumns', function (assert) {

    const done = assert.async(),
        modifier = new InvertModifier(),
        table = new DataTable({
            columns: {
                x: [4, 3, 2, 1, 0],
                y: ['a', 'b', 'c', 'd', 'e']
            }
        });

    table
        .setModifier(modifier)
        .then((table) => {

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

            assert.strictEqual(
                table.modified.getRowCount(),
                2,
                'Inverted table should contain only two column as row.'
            );

            table.deleteColumns(['x']);

            assert.strictEqual(
                table.modified.getRowCount(),
                1,
                'Inverted table should contain only one column as row.'
            );

        })
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );

});

QUnit.test('InvertModifier.modifyRows', function (assert) {

    const done = assert.async(),
        modifier = new InvertModifier(),
        table = new DataTable({
            columns: {
                x: [4, 3, 2, 1, 0],
                y: ['a', 'b', 'c', 'd', 'e']
            }
        });

    table
        .setModifier(modifier)
        .then((table) => {

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

            assert.strictEqual(
                table.modified.getColumnNames().length,
                7,
                'Inverted table should contain six rows (plus one extra) as columns.'
            );

            table.deleteRows(2, 1);

            assert.strictEqual(
                table.modified.getColumnNames().length,
                6,
                'Inverted table should contain only five rows (plus one extra) as columns.'
            );

        })
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );

});
