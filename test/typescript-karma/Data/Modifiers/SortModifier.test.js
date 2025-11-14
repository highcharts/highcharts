import DataTable from '/base/code/es-modules/Data/DataTable.js';
import SortModifier from '/base/code/es-modules/Data/Modifiers/SortModifier.js';

QUnit.test('SortModifier.modify', (assert) => {

    const done = assert.async(),
        table = new DataTable({
            columns: {
                x: [ 0, 1, 2 ],
                y: [ 3, 1, 2 ]
            }
        }),
        ascXModifier = new SortModifier({
            direction: 'asc',
            orderByColumn: 'x'
        }),
        descYModifier = new SortModifier({
            direction: 'desc',
            orderByColumn: 'y'
        });

    descYModifier
        .modify(table.clone())
        .then((tableDescY) => {
            assert.deepEqual(
                tableDescY.getModified().getColumn('x'),
                [0, 2, 1],
                'Sorted table should be in descending order of Y values.'
            );
            return tableDescY;
        })
        .then((tableDescY) =>
            ascXModifier.modify(tableDescY.getModified().clone())
        )
        .then((tableAscX) =>
            assert.deepEqual(
                tableAscX.getModified().getColumns(['x', 'y']),
                table.getColumns(['x', 'y']),
                'Resorted table should be ordered the same as original.'
            )
        )
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );

});
