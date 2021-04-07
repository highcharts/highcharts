import DataTable from '/base/js/Data/DataTable.js';
import SortModifier from '/base/js/Data/Modifiers/SortModifier.js';

QUnit.test('SortModifier.execute', (assert) => {

    const table = new DataTable({
            x: [ 0, 1, 2 ],
            y: [ 3, 1, 2 ]
        }),
        ascXModifier = new SortModifier({
            direction: 'asc',
            orderByColumn: 'x'
        }),
        descYModifier = new SortModifier({
            direction: 'desc',
            orderByColumn: 'y'
        }),
        tableDescY = descYModifier.modify(table.clone()),
        tableAscX = ascXModifier.modify(tableDescY.clone());

    assert.deepEqual(
        tableDescY.getColumn('x'),
        [0, 2, 1],
        'Sorted table should be in descending order of Y values.'
    );

    assert.deepEqual(
        tableAscX.getColumns(['x', 'y']),
        table.getColumns(['x', 'y']),
        'Resorted table should be ordered the same as original.'
    );

});
