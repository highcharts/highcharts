import DataTable from '/base/code/es-modules/Data/DataTable.js';
import SortModifier from '/base/code/es-modules/Data/Modifiers/SortModifier.js';

QUnit.test('SortModifier.modify with multi-column', (assert) => {
    const done = assert.async();
    const table = new DataTable({
        columns: {
            x: [1, 2, 1, 2, 1],
            y: [5, 4, 3, 2, 1],
            id: ['a', 'b', 'c', 'd', 'e']
        }
    });

    // Wanted order: x asc, then y asc
    // x: 1, 1, 1, 2, 2
    // y: 1, 3, 5, 2, 4
    // id: e, c, a, d, b

    const modifier = new SortModifier({
        columns: [
            { column: 'x', direction: 'asc' },
            { column: 'y', direction: 'asc' }
        ]
    });

    modifier.modify(table.clone())
        .then((modifiedTable) => {
            const columns = modifiedTable.getModified().getColumns(['x', 'y', 'id']);
            
            assert.deepEqual(
                columns.id,
                ['e', 'c', 'a', 'd', 'b'],
                'Table should be sorted by x (asc) then y (asc)'
            );

            assert.strictEqual(
                modifiedTable.getModified().getOriginalRowIndex(0), 4,
                'Sorted table should map local index 0 to original index 4'
            );
            assert.strictEqual(
                modifiedTable.getModified().getOriginalRowIndex(2), 0,
                'Sorted table should map local index 2 to original index 0'
            );
            assert.strictEqual(
                modifiedTable.getModified().getLocalRowIndex(0), 2,
                'Sorted table should map original index 0 to local index 2'
            );
            assert.strictEqual(
                modifiedTable.getModified().getLocalRowIndex(4), 0,
                'Sorted table should map original index 4 to local index 0'
            );
        })
        .catch((e) => {
            assert.notOk(true, 'Modifier failed: ' + e);
        })
        .finally(() => {
            done();
        });
});
