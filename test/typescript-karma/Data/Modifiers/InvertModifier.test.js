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

            const tableColumnIds = table.getColumnIds();

            assert.notStrictEqual(
                table.getModified(),
                table,
                'The inverted table should be a new table instance.'
            );

            assert.strictEqual(
                table.getModified().getRowCount(),
                tableColumnIds.length,
                'Original and inverted table should have an inverted amount of columns and rows.'
            );

            assert.deepEqual(
                table.getModified().getColumn('columnIds'),
                tableColumnIds,
                'Row names of inverted table should be the same as column names of original table.'
            );

            return modifier
                .modify(table.getModified().clone())
                .then((modified) =>
                    assert.deepEqual(
                        modified.getModified().getColumns(),
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
